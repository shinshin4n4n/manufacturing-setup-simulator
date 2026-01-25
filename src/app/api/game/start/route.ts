import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { findOptimalSequence } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * Request body type for POST /api/game/start
 */
interface GameStartRequest {
  difficulty: number;
}

/**
 * Equipment response type
 */
interface EquipmentResponse {
  id: string;
  code: string;
  name: string;
  description: string | null;
}

/**
 * Response type for POST /api/game/start
 */
interface GameStartResponse {
  sessionId: string;
  equipments: EquipmentResponse[];
  optimalTime: number;
  optimalSequence: string[];
}

/**
 * Error response type
 */
interface ErrorResponse {
  error: string;
  message: string;
}

/**
 * POST /api/game/start
 *
 * Creates a new game session and returns equipment data with optimal solution
 *
 * @param request - Next.js request object
 * @returns Game session data including sessionId, equipments, optimalTime, and optimalSequence
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: GameStartRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      );
    }

    // Validate request body
    if (typeof body.difficulty !== 'number') {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Invalid difficulty',
          message: 'Difficulty must be a number',
        },
        { status: 400 }
      );
    }

    if (body.difficulty < 1 || body.difficulty > 5) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Invalid difficulty',
          message: 'Difficulty must be between 1 and 5',
        },
        { status: 400 }
      );
    }

    // Generate session ID
    const sessionId = uuidv4();

    // Get all equipment from database
    const equipments = await prisma.equipment.findMany({
      orderBy: { code: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
      },
    });

    if (equipments.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'No equipment found',
          message: 'No equipment data available in the database',
        },
        { status: 500 }
      );
    }

    // Calculate optimal sequence
    let optimalResult;
    try {
      optimalResult = await findOptimalSequence();
    } catch (error) {
      console.error('Error finding optimal sequence:', error);
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Calculation error',
          message: 'Failed to calculate optimal sequence',
        },
        { status: 500 }
      );
    }

    // Prepare response
    const response: GameStartResponse = {
      sessionId,
      equipments,
      optimalTime: optimalResult.time,
      optimalSequence: optimalResult.sequence,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in /api/game/start:', error);
    return NextResponse.json<ErrorResponse>(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
