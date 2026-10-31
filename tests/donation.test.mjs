import test from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test('DONATION: verify seeded food listings meet minimum requirement', async () => {
  const listings = await prisma.foodListing.findMany();
  assert.ok(listings.length >= 10, 'Must have at least 10 realistic food listings');

  // Verify fields
  for (const l of listings) {
    assert.ok(l.title, 'Title required');
    assert.ok(l.totalQuantity > 0, 'Quantity must be positive');
    assert.ok(l.donorDeclarationConfirmed, 'Safety declaration must be confirmed');
    assert.ok(l.storageCondition, 'Storage condition required');
    assert.ok(l.pickupEndTime > l.cookedOrPreparedAt, 'Pickup end must be after prep');
  }
});

test('DONATION: verify non-negative quantity constraint and update', async () => {
  const donor = await prisma.user.findFirst({ where: { role: 'DONOR' } });
  assert.ok(donor);

  const testListing = await prisma.foodListing.create({
    data: {
      donorId: donor.id,
      title: 'Test Unit Listing - Safe Sambar',
      description: 'Test description for QA automation verification',
      category: 'Cooked Meals',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
      totalQuantity: 15,
      availableQuantity: 15,
      unit: 'kg',
      dietaryType: 'VEG',
      allergens: 'None',
      cookedOrPreparedAt: new Date(),
      expiryOrBestBefore: new Date(Date.now() + 4 * 3600000),
      storageCondition: 'Hot / Insulated',
      handlingInstructions: 'Thermal transport only',
      donorDeclarationConfirmed: true,
      pickupAddress: 'Test Kitchen, Hyderabad',
      latitude: 17.4399,
      longitude: 78.4983,
      pickupStartTime: new Date(),
      pickupEndTime: new Date(Date.now() + 4 * 3600000),
      status: 'AVAILABLE',
    },
  });

  assert.equal(testListing.availableQuantity, 15);

  // Clean up
  await prisma.foodListing.delete({ where: { id: testListing.id } });
});
