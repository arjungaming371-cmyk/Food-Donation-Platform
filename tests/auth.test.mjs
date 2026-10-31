import test from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'foodbridge-super-secret-jwt-key-hackathon-2026';

test('AUTH: verify seeded accounts and password hashing', async () => {
  const donor = await prisma.user.findUnique({
    where: { email: 'donor1@foodbridge.org' },
    include: { donorProfile: true },
  });
  assert.ok(donor, 'Donor 1 must exist');
  assert.equal(donor.role, 'DONOR');
  assert.ok(donor.donorProfile, 'Donor profile must exist');

  const validPw = await bcrypt.compare('demo123', donor.password);
  assert.equal(validPw, true, 'Password must match demo123');

  const invalidPw = await bcrypt.compare('wrongpassword', donor.password);
  assert.equal(invalidPw, false, 'Invalid password must be rejected');
});

test('AUTH: verify recipient organization profile', async () => {
  const recipient = await prisma.user.findUnique({
    where: { email: 'hope@ngo.org' },
    include: { orgProfile: true },
  });
  assert.ok(recipient, 'Hope Community Foundation must exist');
  assert.equal(recipient.role, 'RECIPIENT');
  assert.equal(recipient.orgProfile.orgType, 'NGO');
  assert.ok(recipient.orgProfile.estimatedPeopleServed >= 100);
});

test('AUTH: verify admin authorization', async () => {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@foodbridge.org' },
  });
  assert.ok(admin, 'Admin account must exist');
  assert.equal(admin.role, 'ADMIN');

  const token = jwt.sign(
    { userId: admin.id, email: admin.email, role: admin.role, name: admin.name },
    JWT_SECRET
  );
  const decoded = jwt.verify(token, JWT_SECRET);
  assert.equal(decoded.role, 'ADMIN');
});
