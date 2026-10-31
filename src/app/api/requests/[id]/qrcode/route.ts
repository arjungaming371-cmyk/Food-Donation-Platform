import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { generateQrDataUrl } from '@/lib/qrcode';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const request = await prisma.donationRequest.findUnique({
      where: { id },
      include: {
        listing: true,
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Must be donor, recipient, or admin
    if (user.id !== request.recipientId && user.id !== request.listing.donorId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate QR payload containing verification verification token
    const verificationPayload = JSON.stringify({
      requestId: request.id,
      code: request.pickupVerificationCode,
      listingTitle: request.listing.title,
      quantity: `${request.requestedQuantity} ${request.listing.unit}`,
    });

    const qrDataUrl = await generateQrDataUrl(verificationPayload);

    return NextResponse.json({
      success: true,
      code: request.pickupVerificationCode,
      qrDataUrl,
      status: request.status,
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
