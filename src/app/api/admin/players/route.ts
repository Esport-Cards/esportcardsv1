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
    const { name, slug, team, teamCode, role, game, country, description, image } = body;

    if (!name || !slug || !team || !role || !game) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const player = await prisma.player.create({
      data: {
        name,
        slug,
        team,
        teamCode: teamCode || team.slice(0, 3).toUpperCase(),
        role,
        game,
        country: country || null,
        description: description || null,
        image: image || null,
      },
    });

    return NextResponse.json(player);
  } catch (error) {
    console.error('Create player error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
