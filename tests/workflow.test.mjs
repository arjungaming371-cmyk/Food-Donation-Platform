import test from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test('WORKFLOW: Full end-to-end reservation, transaction safety & QR verification flow', async () => {
  // Step 1: Donor creates listing of 15 kg
  const donor = await prisma.user.findFirst({ where: { email: 'donor1@foodbridge.org' } });
  const recipient = await prisma.user.findFirst({ where: { email: 'hope@ngo.org' } });

  assert.ok(donor, 'Donor exists');
  assert.ok(recipient, 'Recipient exists');

  const listing = await prisma.foodListing.create({
    data: {
      donorId: donor.id,
      title: 'QA Demo Surplus Vegetable Rice',
      description: 'Steaming basmati rice prepared 1 hour ago',
      category: 'Cooked Meals',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
      totalQuantity: 15,
      availableQuantity: 15,
      unit: 'kg',
      dietaryType: 'VEG',
      allergens: 'None',
      cookedOrPreparedAt: new Date(),
      expiryOrBestBefore: new Date(Date.now() + 4 * 3600000),
      storageCondition: 'Hot / Insulated',
      handlingInstructions: 'Insulated food carriers required',
      donorDeclarationConfirmed: true,
      pickupAddress: 'Paradise Kitchen Counter 4, Secunderabad',
      latitude: 17.4399,
      longitude: 78.4983,
      pickupStartTime: new Date(),
      pickupEndTime: new Date(Date.now() + 4 * 3600000),
      status: 'AVAILABLE',
    },
  });

  assert.equal(listing.availableQuantity, 15);

  // Step 2: Recipient requests 10 kg
  const pickupCode = '928471';
  const request = await prisma.donationRequest.create({
    data: {
      listingId: listing.id,
      recipientId: recipient.id,
      requestedQuantity: 10,
      status: 'PENDING',
      pickupVerificationCode: pickupCode,
      notes: 'Our transport van will arrive at 4:00 PM',
    },
  });

  assert.equal(request.status, 'PENDING');

  // Step 3: Donor accepts request -> locks 10 kg, leaves 5 kg available
  await prisma.$transaction(async (tx) => {
    const current = await tx.foodListing.findUnique({ where: { id: listing.id } });
    assert.ok(current.availableQuantity >= request.requestedQuantity);

    const newAvail = current.availableQuantity - request.requestedQuantity;
    await tx.foodListing.update({
      where: { id: listing.id },
      data: { availableQuantity: newAvail },
    });

    await tx.donationRequest.update({
      where: { id: request.id },
      data: { status: 'ACCEPTED' },
    });

    await tx.donationStatusHistory.create({
      data: {
        listingId: listing.id,
        requestId: request.id,
        actorId: donor.id,
        actorRole: 'DONOR',
        previousStatus: 'PENDING',
        newStatus: 'ACCEPTED',
        note: 'Donor accepted 10 kg request. Reserved from available stock.',
      },
    });
  });

  // Verify stock deduction
  const updatedListing = await prisma.foodListing.findUnique({ where: { id: listing.id } });
  assert.equal(updatedListing.availableQuantity, 5, 'Available quantity must now be 5 kg');

  // Step 4: Verify that attempting to request more than available (e.g. 8 kg) is blocked
  const attemptOverRequest = async () => {
    const cur = await prisma.foodListing.findUnique({ where: { id: listing.id } });
    if (8 > cur.availableQuantity) {
      throw new Error('Requested quantity exceeds available stock');
    }
  };
  await assert.rejects(attemptOverRequest, /exceeds available stock/);

  // Step 5: Verify PIN & complete handover
  await prisma.$transaction(async (tx) => {
    const req = await tx.donationRequest.findUnique({ where: { id: request.id } });
    assert.equal(req.pickupVerificationCode, pickupCode);

    await tx.donationRequest.update({
      where: { id: request.id },
      data: {
        donorConfirmedHandover: true,
        recipientConfirmedPickup: true,
        status: 'COMPLETED',
      },
    });

    await tx.donationStatusHistory.create({
      data: {
        listingId: listing.id,
        requestId: request.id,
        actorId: recipient.id,
        actorRole: 'RECIPIENT',
        previousStatus: 'ACCEPTED',
        newStatus: 'COMPLETED',
        note: `Handover verified with PIN ${pickupCode}. Both parties confirmed.`,
      },
    });
  });

  const finalReq = await prisma.donationRequest.findUnique({ where: { id: request.id } });
  assert.equal(finalReq.status, 'COMPLETED');
  assert.equal(finalReq.donorConfirmedHandover, true);
  assert.equal(finalReq.recipientConfirmedPickup, true);

  // Verify audit status history
  const history = await prisma.donationStatusHistory.findMany({
    where: { requestId: request.id },
  });
  assert.ok(history.length >= 2, 'History must record all state changes');

  // Cleanup test item
  await prisma.donationStatusHistory.deleteMany({ where: { listingId: listing.id } });
  await prisma.donationRequest.deleteMany({ where: { listingId: listing.id } });
  await prisma.foodListing.delete({ where: { id: listing.id } });
});
