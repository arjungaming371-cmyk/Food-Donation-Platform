import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let whereClause: any = {};
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (user.role === 'DONOR') {
      whereClause.listing = { donorId: user.id };
    } else if (user.role === 'RECIPIENT') {
      whereClause.recipientId = user.id;
    } // Admin sees all

    const requests = await prisma.donationRequest.findMany({
      where: whereClause,
      include: {
        listing: {
          include: {
            donor: {
              select: {
                id: true,
                name: true,
                phone: true,
                address: true,
                donorProfile: true,
              },
            },
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            phone: true,
            orgProfile: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('Requests GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch donation requests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'RECIPIENT') {
      return NextResponse.json({ error: 'Only registered recipient organizations can request food' }, { status: 403 });
    }

    const { listingId, requestedQuantity, notes } = await req.json();

    const qty = parseFloat(requestedQuantity);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json({ error: 'Requested quantity must be positive' }, { status: 400 });
    }

    // Database transaction to prevent race conditions & double-booking
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch listing with lock
      const listing = await tx.foodListing.findUnique({
        where: { id: listingId },
        include: { donor: true },
      });

      if (!listing) {
        throw new Error('Food listing not found');
      }

      if (listing.status !== 'AVAILABLE') {
        throw new Error(`Listing is currently ${listing.status} and cannot accept new requests.`);
      }

      if (listing.pickupEndTime < new Date()) {
        throw new Error('Listing pickup window has already expired.');
      }

      if (qty > listing.availableQuantity) {
        throw new Error(
          `Requested quantity (${qty} ${listing.unit}) exceeds currently available quantity (${listing.availableQuantity} ${listing.unit}).`
        );
      }

      // 2. Check if this recipient already has a pending or accepted request for this listing
      const existingReq = await tx.donationRequest.findFirst({
        where: {
          listingId,
          recipientId: user.id,
          status: { in: ['PENDING', 'ACCEPTED'] },
        },
      });

      if (existingReq) {
        throw new Error('You already have an active request for this listing.');
      }

      // 3. Generate unique 6-digit pickup verification code
      const pickupVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // 4. Create donation request
      const request = await tx.donationRequest.create({
        data: {
          listingId,
          recipientId: user.id,
          requestedQuantity: qty,
          status: 'PENDING',
          pickupVerificationCode,
          notes: notes || '',
        },
      });

      // 5. Add status history entry
      await tx.donationStatusHistory.create({
        data: {
          listingId,
          requestId: request.id,
          actorId: user.id,
          actorRole: user.role,
          previousStatus: null,
          newStatus: 'PENDING',
          note: `Recipient requested ${qty} ${listing.unit}. Notes: ${notes || 'None'}.`,
        },
      });

      // 6. Notify donor
      await tx.notification.create({
        data: {
          userId: listing.donorId,
          title: 'New Food Donation Request',
          message: `${user.name} submitted a request for ${qty} ${listing.unit} of "${listing.title}".`,
          type: 'REQUEST_RECEIVED',
          link: '/donor/requests',
        },
      });

      return { request, listingTitle: listing.title };
    });

    return NextResponse.json({ success: true, request: result.request }, { status: 201 });
  } catch (error: any) {
    console.error('Request creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit request' }, { status: 400 });
  }
}
