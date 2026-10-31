import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateSmartMatch } from '@/lib/matching';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const currentUser = await getCurrentUser();

    const listing = await prisma.foodListing.findUnique({
      where: { id },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            city: true,
            donorProfile: {
              select: {
                businessName: true,
                businessType: true,
                verified: true,
                pickupInstructions: true,
              },
            },
          },
        },
        requests: {
          include: {
            recipient: {
              select: {
                id: true,
                name: true,
                orgProfile: {
                  select: {
                    orgName: true,
                    orgType: true,
                    estimatedPeopleServed: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        statusHistory: {
          include: {
            actor: {
              select: {
                name: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Food listing not found' }, { status: 404 });
    }

    let smartMatch = null;
    if (currentUser?.role === 'RECIPIENT') {
      smartMatch = calculateSmartMatch(
        {
          category: listing.category,
          availableQuantity: listing.availableQuantity,
          unit: listing.unit,
          dietaryType: listing.dietaryType,
          pickupStartTime: listing.pickupStartTime,
          pickupEndTime: listing.pickupEndTime,
          latitude: listing.latitude,
          longitude: listing.longitude,
        },
        {
          estimatedPeopleServed: currentUser.orgProfile?.estimatedPeopleServed || 100,
          latitude: currentUser.latitude,
          longitude: currentUser.longitude,
        }
      );
    }

    return NextResponse.json({ success: true, listing: { ...listing, smartMatch } });
  } catch (error) {
    console.error('Get listing detail error:', error);
    return NextResponse.json({ error: 'Server error retrieving listing' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const listing = await prisma.foodListing.findUnique({
      where: { id },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Must be donor who owns it or Admin
    if (user.role !== 'ADMIN' && listing.donorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden. You do not own this listing' }, { status: 403 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.foodListing.update({
        where: { id },
        data: { status: 'REMOVED' },
      });

      await tx.donationStatusHistory.create({
        data: {
          listingId: id,
          actorId: user.id,
          actorRole: user.role,
          previousStatus: listing.status,
          newStatus: 'REMOVED',
          note: `Listing marked as REMOVED by ${user.role}.`,
        },
      });

      if (user.role === 'ADMIN') {
        await tx.adminAuditLog.create({
          data: {
            adminId: user.id,
            action: 'REMOVE_LISTING',
            targetType: 'LISTING',
            targetId: id,
            details: `Admin removed listing "${listing.title}".`,
          },
        });
      }
    });

    return NextResponse.json({ success: true, message: 'Listing removed successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}
