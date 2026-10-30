import { NextResponse } from 'next/server';
import { CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uptimeSeconds = Math.floor(process.uptime());

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    app: {
      name: CONFIG.app.name,
      version: CONFIG.app.version,
      uptimeSeconds,
    },
    sources: {
      renfeData: {
        positionsEndpoint: CONFIG.renfe.vehiclePositionsUrl,
        tripsEndpoint: CONFIG.renfe.tripUpdatesUrl,
        license: CONFIG.renfe.license,
      },
    },
  });
}

