import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'foodbridge-super-secret-jwt-key-hackathon-2026';
const COOKIE_NAME = 'foodbridge_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'DONOR' | 'RECIPIENT' | 'ADMIN';
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        donorProfile: true,
        orgProfile: true,
      },
    });

    if (!user || user.isSuspended) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'DONOR' | 'RECIPIENT' | 'ADMIN',
      phone: user.phone,
      address: user.address,
      city: user.city,
      latitude: user.latitude,
      longitude: user.longitude,
      donorProfile: user.donorProfile,
      orgProfile: user.orgProfile,
    };
  } catch (err) {
    return null;
  }
}

export function createAuthCookieHeader(token: string) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
}

export function createClearAuthCookieHeader() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
