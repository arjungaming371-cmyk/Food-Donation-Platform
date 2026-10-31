import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateSmartMatch } from '@/lib/matching';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase();
    const category = searchParams.get('category');
    const dietary = searchParams.get('dietary');
    const status = searchParams.get('status') || 'AVAILABLE';
    const donorId = searchParams.get('donorId');
    const sort = searchParams.get('sort') || 'newest';

    const currentUser = await getCurrentUser();

    const whereClause: any = {};

    if (status !== 'ALL') {
      whereClause.status = status;
    }

    if (donorId) {
      whereClause.donorId = donorId;
    }

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    if (dietary && dietary !== 'ALL') {
      whereClause.dietaryType = dietary;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { pickupAddress: { contains: search } },
      ];
    }

    const orderByClause: any =
      sort === 'ending_soon'
        ? { pickupEndTime: 'asc' }
        : sort === 'quantity'
        ? { availableQuantity: 'desc' }
        : { createdAt: 'desc' };

    const listings = await prisma.foodListing.findMany({
      where: whereClause,
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
              },
            },
          },
        },
        _count: {
          select: { requests: true },
        },
      },
      orderBy: orderByClause,
    });

    // If current user is an organization, calculate smart matching score for each listing!
    const listingsWithScores = listings.map((item) => {
      let smartMatch = null;
      if (currentUser?.role === 'RECIPIENT') {
        smartMatch = calculateSmartMatch(
          {
            category: item.category,
            availableQuantity: item.availableQuantity,
            unit: item.unit,
            dietaryType: item.dietaryType,
            pickupStartTime: item.pickupStartTime,
            pickupEndTime: item.pickupEndTime,
            latitude: item.latitude,
            longitude: item.longitude,
          },
          {
            estimatedPeopleServed: currentUser.orgProfile?.estimatedPeopleServed || 100,
            latitude: currentUser.latitude,
            longitude: currentUser.longitude,
          }
        );
      }
      return {
        ...item,
        smartMatch,
      };
    });

    return NextResponse.json({ success: true, listings: listingsWithScores });
  } catch (error) {
    console.error('Listings GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve listings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (user.role !== 'DONOR') {
      return NextResponse.json({ error: 'Only registered donors can create listings' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      imageUrl,
      quantity,
      unit = 'kg',
      dietaryType = 'VEG',
      allergens,
      cookedOrPreparedAt,
      expiryOrBestBefore,
      storageCondition,
      handlingInstructions,
      donorDeclarationConfirmed,
      pickupAddress,
      pickupStartTime,
      pickupEndTime,
      latitude,
      longitude,
    } = body;

    // Safety Declaration check per Hackathon specifications
    if (!donorDeclarationConfirmed) {
      return NextResponse.json(
        {
          error:
            'Mandatory Food Safety Declaration must be accepted before publishing surplus food.',
        },
        { status: 400 }
      );
    }

    const totalQty = parseFloat(quantity);
    if (isNaN(totalQty) || totalQty <= 0) {
      return NextResponse.json({ error: 'Available quantity must be greater than zero' }, { status: 400 });
    }

    const prepDate = cookedOrPreparedAt ? new Date(cookedOrPreparedAt) : new Date();
    const expiryDate = expiryOrBestBefore ? new Date(expiryOrBestBefore) : new Date(Date.now() + 6 * 3600000);
    const startDate = pickupStartTime ? new Date(pickupStartTime) : new Date();
    const endDate = pickupEndTime ? new Date(pickupEndTime) : expiryDate;

    if (endDate <= startDate) {
      return NextResponse.json({ error: 'Pickup end time must be after pickup start time' }, { status: 400 });
    }

    const listing = await prisma.$transaction(async (tx) => {
      const created = await tx.foodListing.create({
        data: {
          donorId: user.id,
          title,
          description: description || '',
          category: category || 'Cooked Meals',
          imageUrl:
            imageUrl ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60',
          totalQuantity: totalQty,
          availableQuantity: totalQty,
          unit,
          dietaryType,
          allergens: allergens || 'None specified',
          cookedOrPreparedAt: prepDate,
          expiryOrBestBefore: expiryDate,
          storageCondition: storageCondition || 'Hot / Insulated',
          handlingInstructions:
            handlingInstructions || 'Keep insulated in food-grade carriers during transport.',
          donorDeclarationConfirmed: true,
          pickupAddress: pickupAddress || user.address || 'Hyderabad',
          pickupCity: user.city || 'Hyderabad',
          latitude: latitude || user.latitude || 17.4399,
          longitude: longitude || user.longitude || 78.4983,
          pickupStartTime: startDate,
          pickupEndTime: endDate,
          status: 'AVAILABLE',
        },
      });

      await tx.donationStatusHistory.create({
        data: {
          listingId: created.id,
          actorId: user.id,
          actorRole: user.role,
          previousStatus: null,
          newStatus: 'AVAILABLE',
          note: `Listing created with quantity ${totalQty} ${unit}. Safety pledge confirmed.`,
        },
      });

      return created;
    });

    return NextResponse.json({ success: true, listing }, { status: 201 });
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
