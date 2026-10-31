import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken, createAuthCookieHeader } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { role } = await req.json();

    let targetEmail = 'donor1@foodbridge.org';
    let redirectPath = '/donor/dashboard';

    if (role === 'RECIPIENT') {
      targetEmail = 'hope@ngo.org';
      redirectPath = '/recipient/dashboard';
    } else if (role === 'ADMIN') {
      targetEmail = 'admin@foodbridge.org';
      redirectPath = '/admin/dashboard';
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: { donorProfile: true, orgProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Demo user not seeded' }, { status: 404 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
    });

    const response = NextResponse.json({
      success: true,
      redirectPath,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.headers.set('Set-Cookie', createAuthCookieHeader(token));
    return response;
  } catch (error) {
    console.error('Demo login error:', error);
    return NextResponse.json({ error: 'Demo login failed' }, { status: 500 });
  }
}
