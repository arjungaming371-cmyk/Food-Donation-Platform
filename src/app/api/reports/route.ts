import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      include: {
        reporter: {
          select: { id: true, name: true, email: true, role: true },
        },
        listing: {
          select: { id: true, title: true, status: true, donor: { select: { name: true } } },
        },
        reportedUser: {
          select: { id: true, name: true, email: true, role: true, isSuspended: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('Reports fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve reports' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { listingId, reportedUserId, reason, details } = await req.json();

    if (!reason || !details) {
      return NextResponse.json({ error: 'Reason and details are required' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        listingId: listingId || null,
        reportedUserId: reportedUserId || null,
        reason,
        details,
        status: 'PENDING',
      },
    });

    if (listingId) {
      await prisma.foodListing.update({
        where: { id: listingId },
        data: { isReported: true },
      });
    }

    // Notify Admins
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((adm) => ({
          userId: adm.id,
          title: 'New Moderation Report',
          message: `Report filed regarding "${reason}". Please investigate.`,
          type: 'REPORT_ALERT',
          link: '/admin/reports',
        })),
      });
    }

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
