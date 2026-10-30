import { NextRequest, NextResponse } from 'next/server';
import { trainService } from '@/services/trainService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const operator = searchParams.get('operator');
    const search = searchParams.get('search')?.toLowerCase().trim();

    const result = await trainService.getAllTrains();

    if (!result.success && result.trains.length === 0) {
      return NextResponse.json(result, {
        status: result.meta.status === 'OFFLINE' ? 503 : 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    let filteredTrains = result.trains;

    if (category && category !== 'ALL') {
      filteredTrains = filteredTrains.filter((t) => t.serviceCategory === category);
    }

    if (operator && operator !== 'ALL') {
      filteredTrains = filteredTrains.filter((t) => t.operator.toLowerCase() === operator.toLowerCase());
    }

    if (search) {
      filteredTrains = filteredTrains.filter(
        (t) =>
          t.trainNumber.toLowerCase().includes(search) ||
          t.commercialName.toLowerCase().includes(search) ||
          t.origin.name.toLowerCase().includes(search) ||
          t.destination.name.toLowerCase().includes(search) ||
          (t.nextStop?.name && t.nextStop.name.toLowerCase().includes(search))
      );
    }

    return NextResponse.json(
      {
        ...result,
        meta: {
          ...result.meta,
          returnedTrains: filteredTrains.length,
        },
        trains: filteredTrains,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20',
        },
      }
    );
  } catch (error) {
    console.error('API /api/trains error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor al procesar el radar de trenes.',
      },
      { status: 500 }
    );
  }
}

