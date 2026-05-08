import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const players = await prisma.player.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, team: true },
  });
  return NextResponse.json(players);
}
