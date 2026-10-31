import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken, createAuthCookieHeader } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      name,
      role, // DONOR or RECIPIENT
      phone,
      address,
      city = 'Hyderabad',
      // Donor specific:
      businessName,
      businessType,
      fssaiNumber,
      pickupInstructions,
      safetyPledgeAccepted,
      // Recipient specific:
      orgName,
      orgType,
      registrationNumber,
      estimatedPeopleServed,
      beneficiaryDescription,
    } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (role !== 'DONOR' && role !== 'RECIPIENT') {
      return NextResponse.json({ error: 'Invalid role selected' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    // Transaction to create User and Profile
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          name,
          role,
          phone: phone || null,
          address: address || 'Hyderabad, Telangana',
          city: city || 'Hyderabad',
          latitude: 17.4200,
          longitude: 78.4800,
        },
      });

      if (role === 'DONOR') {
        await tx.donorProfile.create({
          data: {
            userId: user.id,
            businessName: businessName || name,
            businessType: businessType || 'Restaurant',
            fssaiNumber: fssaiNumber || null,
            pickupInstructions: pickupInstructions || 'Contact manager upon arrival for handover.',
            verified: true,
            safetyPledgeAccepted: safetyPledgeAccepted !== false,
          },
        });
      } else if (role === 'RECIPIENT') {
        await tx.organizationProfile.create({
          data: {
            userId: user.id,
            orgName: orgName || name,
            orgType: orgType || 'NGO',
            registrationNumber: registrationNumber || null,
            estimatedPeopleServed: Number(estimatedPeopleServed) || 100,
            serviceArea: city || 'Hyderabad',
            beneficiaryDescription: beneficiaryDescription || 'Community meal distribution program.',
            verified: true,
          },
        });
      }

      return user;
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as any,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });

    response.headers.set('Set-Cookie', createAuthCookieHeader(token));
    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}
