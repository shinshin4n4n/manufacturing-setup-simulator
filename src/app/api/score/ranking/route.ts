import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * Ranking entry type
 */
interface RankingEntry {
  rank: number;
  playerName: string;
  score: number;
  totalTime: number;
  completedAt: string;
}

/**
 * Response type for GET /api/score/ranking
 */
interface RankingResponse {
  rankings: RankingEntry[];
  total: number;
}

/**
 * Error response type
 */
interface ErrorResponse {
  error: string;
  message: string;
}

/**
 * GET /api/score/ranking
 *
 * Retrieves top rankings filtered by difficulty
 *
 * Query parameters:
 * - difficulty: Difficulty level (default: 1, range: 1-5)
 * - limit: Number of results to return (default: 10, max: 100)
 *
 * @param request - Next.js request object
 * @returns Rankings list with rank, playerName, score, totalTime, completedAt
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const difficultyParam = searchParams.get('difficulty');
    const limitParam = searchParams.get('limit');

    // Parse and validate difficulty
    let difficulty = 1; // Default difficulty
    if (difficultyParam !== null) {
      const parsedDifficulty = parseInt(difficultyParam, 10);
      if (isNaN(parsedDifficulty)) {
        return NextResponse.json<ErrorResponse>(
          {
            error: 'Invalid difficulty',
            message: 'Difficulty must be a number',
          },
          { status: 400 }
        );
      }
      if (parsedDifficulty < 1 || parsedDifficulty > 5) {
        return NextResponse.json<ErrorResponse>(
          {
            error: 'Invalid difficulty',
            message: 'Difficulty must be between 1 and 5',
          },
          { status: 400 }
        );
      }
      difficulty = parsedDifficulty;
    }

    // Parse and validate limit
    let limit = 10; // Default limit
    if (limitParam !== null) {
      const parsedLimit = parseInt(limitParam, 10);
      if (isNaN(parsedLimit)) {
        return NextResponse.json<ErrorResponse>(
          {
            error: 'Invalid limit',
            message: 'Limit must be a number',
          },
          { status: 400 }
        );
      }
      if (parsedLimit < 1) {
        return NextResponse.json<ErrorResponse>(
          {
            error: 'Invalid limit',
            message: 'Limit must be at least 1',
          },
          { status: 400 }
        );
      }
      if (parsedLimit > 100) {
        return NextResponse.json<ErrorResponse>(
          {
            error: 'Invalid limit',
            message: 'Limit cannot exceed 100',
          },
          { status: 400 }
        );
      }
      limit = parsedLimit;
    }

    // Get total count for the difficulty
    let total: number;
    try {
      total = await prisma.gameSession.count({
        where: {
          difficulty,
        },
      });
    } catch (error) {
      console.error('Error counting game sessions:', error);
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Database error',
          message: 'Failed to count game sessions',
        },
        { status: 500 }
      );
    }

    // Get top rankings
    let sessions;
    try {
      sessions = await prisma.gameSession.findMany({
        where: {
          difficulty,
        },
        orderBy: [
          { score: 'desc' }, // Higher score first
          { completedAt: 'asc' }, // Earlier completion time as tiebreaker
        ],
        take: limit,
        select: {
          playerName: true,
          score: true,
          totalTime: true,
          completedAt: true,
        },
      });
    } catch (error) {
      console.error('Error fetching game sessions:', error);
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Database error',
          message: 'Failed to fetch rankings',
        },
        { status: 500 }
      );
    }

    // Add rank numbers (1-based)
    const rankings: RankingEntry[] = sessions.map((session, index) => ({
      rank: index + 1,
      playerName: session.playerName,
      score: session.score,
      totalTime: session.totalTime,
      completedAt: session.completedAt.toISOString(),
    }));

    // Prepare response
    const response: RankingResponse = {
      rankings,
      total,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in /api/score/ranking:', error);
    return NextResponse.json<ErrorResponse>(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
