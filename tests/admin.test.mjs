import test from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test('ADMIN: verify moderation reports and audit logging', async () => {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const donor = await prisma.user.findFirst({ where: { role: 'DONOR' } });
  const recipient = await prisma.user.findFirst({ where: { role: 'RECIPIENT' } });

  assert.ok(admin);
  assert.ok(donor);
  assert.ok(recipient);

  // 1. Recipient creates a report
  const report = await prisma.report.create({
    data: {
      reporterId: recipient.id,
      reportedUserId: donor.id,
      reason: 'Incorrect food information',
      details: 'Packaging label did not match listed category.',
      status: 'PENDING',
    },
  });

  assert.equal(report.status, 'PENDING');

  // 2. Admin resolves report
  await prisma.report.update({
    where: { id: report.id },
    data: {
      status: 'RESOLVED',
      adminNotes: 'Reviewed with donor kitchen manager.',
    },
  });

  const updatedReport = await prisma.report.findUnique({ where: { id: report.id } });
  assert.equal(updatedReport.status, 'RESOLVED');

  // 3. Admin logs audit action
  const audit = await prisma.adminAuditLog.create({
    data: {
      adminId: admin.id,
      action: 'RESOLVE_REPORT',
      targetType: 'REPORT',
      targetId: report.id,
      details: 'Report marked resolved after telephone review with kitchen.',
    },
  });

  assert.ok(audit.id);

  // Clean up test report & audit log
  await prisma.adminAuditLog.delete({ where: { id: audit.id } });
  await prisma.report.delete({ where: { id: report.id } });
});
