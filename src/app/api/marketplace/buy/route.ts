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

    const buyer = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!buyer) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { listingId } = await request.json();

    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: listingId },
      include: { ownedCard: true },
    });

    if (!listing || !listing.isActive || listing.buyerId) {
      return NextResponse.json({ error: 'Listing not available' }, { status: 400 });
    }

    if (listing.sellerId === buyer.id) {
      return NextResponse.json({ error: 'Cannot buy your own listing' }, { status: 400 });
    }

    // Process purchase
    const result = await prisma.$transaction(async (tx) => {
      // Update listing
      await tx.marketplaceListing.update({
        where: { id: listingId },
        data: {
          buyerId: buyer.id,
          soldAt: new Date(),
          isActive: false,
        },
      });

      // Transfer card ownership
      await tx.ownedCard.update({
        where: { id: listing.ownedCardId },
        data: { ownerId: buyer.id },
      });

      return { success: true };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Buy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
