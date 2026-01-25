import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  calculateTotalSetupTime,
  findOptimalSequence,
  calculateScore,
  getRank,
  type Rank,
} from '@/lib/utils';

const prisma = new PrismaClient();

/**
 * Request body type for POST /api/game/submit
 */
interface GameSubmitRequest {
  playerName: string;
  sequence: string[];
  totalTime: number;
  difficulty: number;
}

/**
 * Response type for POST /api/game/submit
 */
interface GameSubmitResponse {
  score: number;
  rank: Rank;
  optimalTime: number;
  ranking: number;
}

/**
 * Error response type
 */
interface ErrorResponse {
  error: string;
  message: string;
}

/**
 * POST /api/game/submit
 *
 * Submits game result, calculates score, and saves to database
 *
 * @param request - Next.js request object
 * @returns Score, rank, optimal time, and ranking position
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: GameSubmitRequest;
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
    if (typeof body.playerName !== 'string' || body.playerName.trim() === '') {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Invalid playerName',
          message: 'Player name must be a non-empty string',
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.sequence) || body.sequence.length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Invalid sequence',
          message: 'Sequence must be a non-empty array',
        },
        { status: 400 }
      );
    }

    if (typeof body.totalTime !== 'number' || body.totalTime <= 0) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Invalid totalTime',
          message: 'Total time must be a positive number',
        },
        { status: 400 }
      );
    }

    if (typeof body.difficulty !== 'number' || body.difficulty < 1 || body.difficulty > 5) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Invalid difficulty',
          message: 'Difficulty must be a number between 1 and 5',
        },
        { status: 400 }
      );
    }

    // Verify total time by calculating from sequence
    let calculatedTime: number;
    try {
      calculatedTime = await calculateTotalSetupTime(body.sequence);
    } catch (error) {
      console.error('Error calculating setup time:', error);
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Invalid sequence',
          message: 'Failed to calculate setup time from sequence',
        },
        { status: 400 }
      );
    }

    // Verify that provided totalTime matches calculated time
    if (Math.abs(calculatedTime - body.totalTime) > 0.01) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Time mismatch',
          message: `Provided time (${body.totalTime}) does not match calculated time (${calculatedTime})`,
        },
        { status: 400 }
      );
    }

    // Get optimal sequence and time
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

    // Calculate score and rank
    const score = calculateScore(body.totalTime, optimalResult.time);
    const rank = getRank(score);

    // Calculate average setup time
    const setupCount = body.sequence.length - 1; // Number of transitions
    const averageTime = setupCount > 0 ? body.totalTime / setupCount : 0;

    // Save to database
    let gameSession;
    try {
      gameSession = await prisma.gameSession.create({
        data: {
          playerName: body.playerName.trim(),
          score: Math.round(score),
          totalTime: body.totalTime,
          setupCount,
          averageTime,
          difficulty: body.difficulty,
        },
      });
    } catch (error) {
      console.error('Error saving game session:', error);
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Database error',
          message: 'Failed to save game session',
        },
        { status: 500 }
      );
    }

    // Calculate ranking (1-based, higher score = better rank)
    let ranking: number;
    try {
      const betterScores = await prisma.gameSession.count({
        where: {
          score: {
            gt: gameSession.score,
          },
        },
      });
      ranking = betterScores + 1;
    } catch (error) {
      console.error('Error calculating ranking:', error);
      // If ranking calculation fails, still return success but with default ranking
      ranking = 0;
    }

    // Prepare response
    const response: GameSubmitResponse = {
      score,
      rank,
      optimalTime: optimalResult.time,
      ranking,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in /api/game/submit:', error);
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
