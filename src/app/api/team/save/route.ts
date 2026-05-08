import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { name, slots } = await request.json();

    if (!name || !slots || !Array.isArray(slots)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Check for duplicate card usage
    const cardIds = slots.map((s: any) => s.ownedCardId);
    if (new Set(cardIds).size !== cardIds.length) {
      return NextResponse.json({ error: 'Cannot use the same card twice' }, { status: 400 });
    }

    // Calculate score
    const rarityScores: Record<string, number> = {
      Common: 1, Rare: 3, Epic: 5, Legendary: 10, Unique: 20,
    };

    const cards = await prisma.ownedCard.findMany({
      where: { id: { in: cardIds } },
    });

    const totalScore = cards.reduce(
      (acc, c) => acc + (rarityScores[c.rarity] || 1),
      0
    );

    // Create lineup
    const lineup = await prisma.teamLineup.create({
      data: {
        userId: user.id,
        name,
        totalScore,
        slots: {
          create: slots.map((slot: any, i: number) => ({
            role: slot.role,
            ownedCardId: slot.ownedCardId,
            position: i + 1,
          })),
        },
      },
      include: { slots: true },
    });

    // Update user stats
    await prisma.userStats.updateMany({
      where: { userId: user.id },
      data: { totalScore: { increment: totalScore } },
    });

    return NextResponse.json(lineup);
  } catch (error) {
    console.error('Team save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
