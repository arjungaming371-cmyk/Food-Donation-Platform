import { NextResponse } from 'next/server';
import { getLiveImpactMetrics } from '@/lib/impact';

export async function GET() {
  try {
    const metrics = await getLiveImpactMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve impact metrics' }, { status: 500 });
  }
}
