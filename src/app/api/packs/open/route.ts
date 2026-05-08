import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateSerial, getRarityWeightedRandom } from '@/lib/utils';
import type { Pack } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packId } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const pack = await prisma.pack.findUnique({
      where: { id: packId },
    });
    if (!pack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Get all card templates
    const allTemplates = await prisma.cardTemplate.findMany({
      include: { player: true },
    });

    if (allTemplates.length === 0) {
      return NextResponse.json({ error: 'No card templates available' }, { status: 400 });
    }

    const openedCards = [];

    for (let i = 0; i < pack.cardCount; i++) {
      // Weighted random rarity
      const rarity = getRarityWeightedRandom();

      // Filter templates by rarity, fallback to any if none match
      let eligibleTemplates = allTemplates.filter(t => t.rarity === rarity);
      if (eligibleTemplates.length === 0) {
        eligibleTemplates = allTemplates;
      }

      // Random template from eligible
      const template = eligibleTemplates[Math.floor(Math.random() * eligibleTemplates.length)];

      // Create owned card
      const ownedCard = await prisma.ownedCard.create({
        data: {
          rarity: template.rarity,
          serialNumber: generateSerial(),
          cardTemplateId: template.id,
          ownerId: user.id,
        },
        include: {
          cardTemplate: {
            include: { player: true },
          },
        },
      });

      openedCards.push(ownedCard);
    }

    // Record pack opening
    await prisma.packOpening.create({
      data: {
        userId: user.id,
        packId: pack.id,
        cardIds: openedCards.map(c => c.id),
      },
    });

    // Update user stats
    await prisma.userStats.upsert({
      where: { userId: user.id },
      update: {
        totalCards: { increment: pack.cardCount },
        packsOpened: { increment: 1 },
      },
      create: {
        userId: user.id,
        totalCards: pack.cardCount,
        packsOpened: 1,
        currentRank: 0,
        totalScore: 0,
      },
    });

    return NextResponse.json({ cards: openedCards });
  } catch (error) {
    console.error('Pack opening error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
