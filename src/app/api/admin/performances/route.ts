import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const { playerId, userId, kills, deaths, assists, headshots, rating } = body;

    const perf = await prisma.weeklyPerformance.create({
      data: {
        playerId,
        userId,
        weekStart: new Date(),
        kills: kills || 0,
        deaths: deaths || 0,
        assists: assists || 0,
        headshots: headshots || 0,
        rating: rating || 1.0,
        score: (kills * 3 + assists * 1) - deaths,
      },
    });

    // Update user stats total score
    await prisma.userStats.updateMany({
      where: { userId },
      data: { totalScore: { increment: perf.score } },
    });

    return NextResponse.json(perf);
  } catch (error) {
    console.error('Performance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
