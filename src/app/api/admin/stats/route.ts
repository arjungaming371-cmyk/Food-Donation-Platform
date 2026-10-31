import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin only' }, { status: 403 });
    }

    const totalUsers = await prisma.user.count();
    const totalDonors = await prisma.user.count({ where: { role: 'DONOR' } });
    const totalRecipients = await prisma.user.count({ where: { role: 'RECIPIENT' } });
    const totalListings = await prisma.foodListing.count();
    const activeDonations = await prisma.foodListing.count({ where: { status: 'AVAILABLE' } });
    const pendingRequests = await prisma.donationRequest.count({ where: { status: 'PENDING' } });
    const completedDonations = await prisma.donationRequest.count({ where: { status: 'COMPLETED' } });
    const pendingReports = await prisma.report.count({ where: { status: 'PENDING' } });

    const auditLogs = await prisma.adminAuditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: { select: { name: true, email: true } },
      },
    });

    const recentEvents = await prisma.donationStatusHistory.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { name: true, role: true } },
        listing: { select: { title: true } },
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        totalRecipients,
        totalListings,
        activeDonations,
        pendingRequests,
        completedDonations,
        pendingReports,
      },
      auditLogs,
      recentEvents,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin stats' }, { status: 500 });
  }
}
