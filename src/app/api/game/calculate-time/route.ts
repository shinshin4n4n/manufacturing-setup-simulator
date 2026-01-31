import { NextRequest, NextResponse } from 'next/server';
import { calculateTotalSetupTime } from '@/lib/utils';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

interface CalculateTimeRequest {
  sequence: string[];
}

interface CalculateTimeResponse {
  totalTime: number;
}

interface ErrorResponse {
  error: string;
  message: string;
}

/**
 * POST /api/game/calculate-time
 *
 * Calculates the total setup time for a given equipment sequence
 */
export async function POST(request: NextRequest) {
  try {
    const body: CalculateTimeRequest = await request.json();

    if (!Array.isArray(body.sequence) || body.sequence.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Invalid sequence',
          message: 'Sequence must be a non-empty array',
        },
        { status: 400 }
      );
    }

    const totalTime = await calculateTotalSetupTime(body.sequence);

    const response: CalculateTimeResponse = {
      totalTime,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error calculating time:', error);
    return NextResponse.json<ErrorResponse>(
      {
        error: 'Calculation error',
        message: 'Failed to calculate setup time',
      },
      { status: 500 }
    );
  }
}
