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
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { ownedCardId, price } = body;

    if (!ownedCardId || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify card ownership
    const card = await prisma.ownedCard.findFirst({
      where: { id: ownedCardId, ownerId: user.id },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found or not owned' }, { status: 400 });
    }

    // Check if already listed
    const existing = await prisma.marketplaceListing.findFirst({
      where: { ownedCardId, isActive: true },
    });

    if (existing) {
      return NextResponse.json({ error: 'Card already listed' }, { status: 400 });
    }

    const listing = await prisma.marketplaceListing.create({
      data: {
        ownedCardId,
        sellerId: user.id,
        price: parseInt(price) * 100, // convert to cents
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
