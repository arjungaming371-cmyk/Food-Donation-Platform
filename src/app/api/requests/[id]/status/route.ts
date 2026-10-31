import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, code, cancellationReason } = await req.json();

    const request = await prisma.donationRequest.findUnique({
      where: { id },
      include: {
        listing: true,
        recipient: true,
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Donation request not found' }, { status: 404 });
    }

    const isDonor = user.id === request.listing.donorId;
    const isRecipient = user.id === request.recipientId;
    const isAdmin = user.role === 'ADMIN';

    if (!isDonor && !isRecipient && !isAdmin) {
      return NextResponse.json({ error: 'You are not authorized to update this request' }, { status: 403 });
    }

    // Execute state transitions safely inside Prisma transaction
    const updated = await prisma.$transaction(async (tx) => {
      const currentListing = await tx.foodListing.findUnique({
        where: { id: request.listingId },
      });
      if (!currentListing) throw new Error('Listing missing');

      if (action === 'ACCEPT') {
        if (!isDonor && !isAdmin) {
          throw new Error('Only the donor can accept this request');
        }
        if (request.status !== 'PENDING') {
          throw new Error(`Cannot accept request in ${request.status} status`);
        }
        if (currentListing.availableQuantity < request.requestedQuantity) {
          throw new Error('Insufficient food quantity remaining to fulfill this request.');
        }

        const newAvail = Math.max(0, currentListing.availableQuantity - request.requestedQuantity);
        const newListingStatus = newAvail === 0 ? 'RESERVED' : currentListing.status;

        await tx.foodListing.update({
          where: { id: request.listingId },
          data: {
            availableQuantity: newAvail,
            status: newListingStatus,
          },
        });

        const updatedReq = await tx.donationRequest.update({
          where: { id },
          data: { status: 'ACCEPTED' },
        });

        await tx.donationStatusHistory.create({
          data: {
            listingId: request.listingId,
            requestId: id,
            actorId: user.id,
            actorRole: user.role,
            previousStatus: 'PENDING',
            newStatus: 'ACCEPTED',
            note: `Donor accepted request for ${request.requestedQuantity} ${currentListing.unit}. Reserved from stock. Pickup PIN: ${request.pickupVerificationCode}.`,
          },
        });

        await tx.notification.create({
          data: {
            userId: request.recipientId,
            title: 'Donation Request Accepted!',
            message: `Your request for "${currentListing.title}" was accepted! Verification PIN is ${request.pickupVerificationCode}. Please review pickup details.`,
            type: 'REQUEST_ACCEPTED',
            link: '/recipient/requests',
          },
        });

        return updatedReq;
      }

      if (action === 'REJECT') {
        if (!isDonor && !isAdmin) {
          throw new Error('Only the donor can reject this request');
        }
        if (request.status !== 'PENDING') {
          throw new Error(`Cannot reject request in ${request.status} status`);
        }

        const updatedReq = await tx.donationRequest.update({
          where: { id },
          data: {
            status: 'REJECTED',
            cancellationReason: cancellationReason || 'Donor was unable to fulfill request at this time.',
          },
        });

        await tx.donationStatusHistory.create({
          data: {
            listingId: request.listingId,
            requestId: id,
            actorId: user.id,
            actorRole: user.role,
            previousStatus: 'PENDING',
            newStatus: 'REJECTED',
            note: `Request rejected. Reason: ${cancellationReason || 'Unavailable'}`,
          },
        });

        await tx.notification.create({
          data: {
            userId: request.recipientId,
            title: 'Donation Request Declined',
            message: `The donor was unable to fulfill your request for "${currentListing.title}".`,
            type: 'REQUEST_REJECTED',
            link: '/recipient/requests',
          },
        });

        return updatedReq;
      }

      if (action === 'CANCEL') {
        if (request.status === 'COMPLETED' || request.status === 'REJECTED') {
          throw new Error(`Cannot cancel a ${request.status} request`);
        }

        // If request was previously ACCEPTED, release reserved quantity back!
        if (request.status === 'ACCEPTED') {
          const restoredQty = currentListing.availableQuantity + request.requestedQuantity;
          await tx.foodListing.update({
            where: { id: request.listingId },
            data: {
              availableQuantity: restoredQty,
              status: 'AVAILABLE',
            },
          });
        }

        const updatedReq = await tx.donationRequest.update({
          where: { id },
          data: {
            status: 'CANCELLED',
            cancellationReason: cancellationReason || 'Cancelled by participant',
          },
        });

        await tx.donationStatusHistory.create({
          data: {
            listingId: request.listingId,
            requestId: id,
            actorId: user.id,
            actorRole: user.role,
            previousStatus: request.status,
            newStatus: 'CANCELLED',
            note: `Request cancelled by ${user.role}. Reason: ${cancellationReason || 'None given'}.`,
          },
        });

        // Notify other party
        const notifyTargetId = isDonor ? request.recipientId : request.listing.donorId;
        await tx.notification.create({
          data: {
            userId: notifyTargetId,
            title: 'Donation Request Cancelled',
            message: `Request for "${currentListing.title}" was cancelled by ${user.name}.`,
            type: 'REQUEST_CANCELLED',
            link: isDonor ? '/recipient/requests' : '/donor/requests',
          },
        });

        return updatedReq;
      }

      // Verification via 6-digit PIN or QR scan
      if (action === 'VERIFY_CODE') {
        if (!code || code.toString().trim() !== request.pickupVerificationCode.trim()) {
          throw new Error('Invalid verification code entered. Please check the 6-digit code or QR token.');
        }

        const now = new Date();
        const updatedReq = await tx.donationRequest.update({
          where: { id },
          data: {
            donorConfirmedHandover: true,
            recipientConfirmedPickup: true,
            donorHandoverAt: now,
            recipientPickupAt: now,
            status: 'COMPLETED',
          },
        });

        // If listing is out of stock, mark listing COMPLETED as well
        if (currentListing.availableQuantity === 0) {
          await tx.foodListing.update({
            where: { id: request.listingId },
            data: { status: 'COMPLETED' },
          });
        }

        await tx.donationStatusHistory.create({
          data: {
            listingId: request.listingId,
            requestId: id,
            actorId: user.id,
            actorRole: user.role,
            previousStatus: request.status,
            newStatus: 'COMPLETED',
            note: `Pickup verified instantly via secure PIN/QR code (${code}). Both handover and collection verified.`,
          },
        });

        // Notify both parties of successful completed donation
        await tx.notification.createMany({
          data: [
            {
              userId: request.listing.donorId,
              title: 'Donation Completed! 🎉',
              message: `Handover confirmed for ${request.requestedQuantity} ${currentListing.unit} of "${currentListing.title}". Thank you for eliminating food waste!`,
              type: 'PICKUP_CONFIRMED',
              link: '/donor/history',
            },
            {
              userId: request.recipientId,
              title: 'Food Received! 🎉',
              message: `Pickup confirmed for "${currentListing.title}". Impact statistics updated.`,
              type: 'PICKUP_CONFIRMED',
              link: '/recipient/history',
            },
          ],
        });

        return updatedReq;
      }

      // Two-party step confirmation:
      if (action === 'CONFIRM_HANDOVER') {
        if (!isDonor && !isAdmin) {
          throw new Error('Only the donor can confirm food handover');
        }

        const willBeCompleted = request.recipientConfirmedPickup;
        const now = new Date();

        const updatedReq = await tx.donationRequest.update({
          where: { id },
          data: {
            donorConfirmedHandover: true,
            donorHandoverAt: now,
            status: willBeCompleted ? 'COMPLETED' : 'PICKED_UP',
          },
        });

        await tx.donationStatusHistory.create({
          data: {
            listingId: request.listingId,
            requestId: id,
            actorId: user.id,
            actorRole: user.role,
            previousStatus: request.status,
            newStatus: willBeCompleted ? 'COMPLETED' : 'PICKED_UP',
            note: 'Donor confirmed physical food handover to recipient driver/volunteer.',
          },
        });

        if (willBeCompleted && currentListing.availableQuantity === 0) {
          await tx.foodListing.update({
            where: { id: request.listingId },
            data: { status: 'COMPLETED' },
          });
        }

        return updatedReq;
      }

      if (action === 'CONFIRM_PICKUP') {
        if (!isRecipient && !isAdmin) {
          throw new Error('Only the recipient organization can confirm receipt');
        }

        const willBeCompleted = request.donorConfirmedHandover;
        const now = new Date();

        const updatedReq = await tx.donationRequest.update({
          where: { id },
          data: {
            recipientConfirmedPickup: true,
            recipientPickupAt: now,
            status: willBeCompleted ? 'COMPLETED' : 'PICKED_UP',
          },
        });

        await tx.donationStatusHistory.create({
          data: {
            listingId: request.listingId,
            requestId: id,
            actorId: user.id,
            actorRole: user.role,
            previousStatus: request.status,
            newStatus: willBeCompleted ? 'COMPLETED' : 'PICKED_UP',
            note: 'Recipient verified food inspection and confirmed collection.',
          },
        });

        if (willBeCompleted && currentListing.availableQuantity === 0) {
          await tx.foodListing.update({
            where: { id: request.listingId },
            data: { status: 'COMPLETED' },
          });
        }

        return updatedReq;
      }

      throw new Error('Unknown workflow action');
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error: any) {
    console.error('Request status update error:', error);
    return NextResponse.json({ error: error.message || 'Workflow update failed' }, { status: 400 });
  }
}
