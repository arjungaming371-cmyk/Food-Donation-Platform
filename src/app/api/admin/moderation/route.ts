import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { action, targetId, reason, adminNotes } = await req.json();

    if (action === 'REMOVE_LISTING') {
      const listing = await prisma.foodListing.findUnique({ where: { id: targetId } });
      if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

      await prisma.$transaction(async (tx) => {
        await tx.foodListing.update({
          where: { id: targetId },
          data: { status: 'REMOVED' },
        });

        await tx.donationStatusHistory.create({
          data: {
            listingId: targetId,
            actorId: user.id,
            actorRole: 'ADMIN',
            previousStatus: listing.status,
            newStatus: 'REMOVED',
            note: `Moderation action: Listing removed. Reason: ${reason || 'Inappropriate or reported content'}.`,
          },
        });

        await tx.adminAuditLog.create({
          data: {
            adminId: user.id,
            action: 'REMOVE_LISTING',
            targetType: 'LISTING',
            targetId,
            details: `Removed listing "${listing.title}". Reason: ${reason || 'Unspecified'}`,
          },
        });

        await tx.notification.create({
          data: {
            userId: listing.donorId,
            title: 'Listing Removed by Moderator',
            message: `Your listing "${listing.title}" was removed due to food safety or platform policy review. Reason: ${reason || 'Terms violation'}`,
            type: 'ADMIN_ACTION',
            link: '/donor/manage',
          },
        });
      });

      return NextResponse.json({ success: true, message: 'Listing removed by admin' });
    }

    if (action === 'SUSPEND_USER' || action === 'RESTORE_USER') {
      const isSuspend = action === 'SUSPEND_USER';
      const targetUser = await prisma.user.findUnique({ where: { id: targetId } });
      if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: targetId },
          data: { isSuspended: isSuspend },
        });

        await tx.adminAuditLog.create({
          data: {
            adminId: user.id,
            action: isSuspend ? 'SUSPEND_USER' : 'RESTORE_USER',
            targetType: 'USER',
            targetId,
            details: `${isSuspend ? 'Suspended' : 'Restored'} user ${targetUser.email}. Reason: ${reason || 'Policy moderation'}`,
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: `User ${isSuspend ? 'suspended' : 'restored'} successfully`,
      });
    }

    if (action === 'RESOLVE_REPORT') {
      const report = await prisma.report.findUnique({ where: { id: targetId } });
      if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

      await prisma.$transaction(async (tx) => {
        await tx.report.update({
          where: { id: targetId },
          data: {
            status: 'RESOLVED',
            adminNotes: adminNotes || 'Investigated and resolved by platform administrator.',
          },
        });

        await tx.adminAuditLog.create({
          data: {
            adminId: user.id,
            action: 'RESOLVE_REPORT',
            targetType: 'REPORT',
            targetId,
            details: `Resolved report #${targetId}. Admin notes: ${adminNotes || 'None'}`,
          },
        });
      });

      return NextResponse.json({ success: true, message: 'Report marked as resolved' });
    }

    return NextResponse.json({ error: 'Unknown moderation action' }, { status: 400 });
  } catch (error) {
    console.error('Moderation action error:', error);
    return NextResponse.json({ error: 'Moderation action failed' }, { status: 500 });
  }
}
