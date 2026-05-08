import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { playerId, rarity, season, image, design } = body;

    if (!playerId || !rarity || !season) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cardTemplate = await prisma.cardTemplate.create({
      data: {
        playerId,
        rarity,
        season,
        image: image || null,
        design: design || 'default',
      },
    });

    return NextResponse.json(cardTemplate);
  } catch (error) {
    console.error('Create card template error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
