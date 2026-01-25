import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface HintRequestBody {
  level: 1 | 2 | 3;
  lastPlacedCode: string | null;
  availableCodes: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: HintRequestBody = await request.json();
    const { level, lastPlacedCode, availableCodes } = body;

    // Validate input
    if (!level || ![1, 2, 3].includes(level)) {
      return NextResponse.json(
        { error: 'Invalid hint level' },
        { status: 400 }
      );
    }

    if (!availableCodes || availableCodes.length === 0) {
      return NextResponse.json(
        { error: 'No available equipment' },
        { status: 400 }
      );
    }

    // Level 3: Return setup matrix
    if (level === 3) {
      const setupMatrix = await prisma.setupMatrix.findMany({
        include: {
          fromEquipment: true,
          toEquipment: true,
        },
      });

      const matrixData = setupMatrix.map((sm) => ({
        from: sm.fromEquipment.code,
        to: sm.toEquipment.code,
        time: sm.setupTime,
      }));

      return NextResponse.json({
        level: 3,
        matrix: matrixData,
      });
    }

    // Level 1 & 2: Calculate best next equipment
    if (!lastPlacedCode) {
      // No equipment placed yet - just return available equipment
      const equipment = await prisma.equipment.findMany({
        where: {
          code: {
            in: availableCodes,
          },
        },
        orderBy: { code: 'asc' },
      });

      const candidates = equipment.map((eq) => ({
        id: eq.id,
        code: eq.code,
        name: eq.name,
        description: eq.description || '',
      }));

      return NextResponse.json({
        level,
        candidates: level === 1 ? candidates.slice(0, 2) : candidates.slice(0, 1),
      });
    }

    // Get the last placed equipment
    const lastEquipment = await prisma.equipment.findUnique({
      where: { code: lastPlacedCode },
    });

    if (!lastEquipment) {
      return NextResponse.json(
        { error: 'Last placed equipment not found' },
        { status: 404 }
      );
    }

    // Calculate setup time for each available equipment
    const candidateScores: Array<{
      equipment: {
        id: string;
        code: string;
        name: string;
        description: string;
      };
      setupTime: number;
    }> = [];

    for (const code of availableCodes) {
      const equipment = await prisma.equipment.findUnique({
        where: { code },
      });

      if (!equipment) continue;

      const setupMatrix = await prisma.setupMatrix.findUnique({
        where: {
          fromEquipmentId_toEquipmentId: {
            fromEquipmentId: lastEquipment.id,
            toEquipmentId: equipment.id,
          },
        },
      });

      if (setupMatrix) {
        candidateScores.push({
          equipment: {
            id: equipment.id,
            code: equipment.code,
            name: equipment.name,
            description: equipment.description || '',
          },
          setupTime: setupMatrix.setupTime,
        });
      }
    }

    // Sort by setup time (ascending)
    candidateScores.sort((a, b) => a.setupTime - b.setupTime);

    // Return top candidates
    const candidates = candidateScores.map((cs) => cs.equipment);

    return NextResponse.json({
      level,
      candidates: level === 1 ? candidates.slice(0, 2) : candidates.slice(0, 1),
    });
  } catch (error) {
    console.error('Error processing hint request:', error);
    return NextResponse.json(
      { error: 'Failed to process hint request' },
      { status: 500 }
    );
  }
}
