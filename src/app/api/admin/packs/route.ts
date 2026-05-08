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
    const { name, slug, description, price, cardCount } = body;

    if (!name || !slug || !price || !cardCount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pack = await prisma.pack.create({
      data: {
        name,
        slug,
        description: description || null,
        price,
        cardCount,
        isActive: true,
      },
    });

    return NextResponse.json(pack);
  } catch (error) {
    console.error('Create pack error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
