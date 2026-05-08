import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: { game?: string; q?: string };
}) {
  const where: any = {};
  if (searchParams.game) where.game = searchParams.game;
  if (searchParams.q) {
    where.name = { contains: searchParams.q, mode: 'insensitive' };
  }

  const players = await prisma.player.findMany({
    where,
    orderBy: { name: 'asc' },
    include: { _count: { select: { cardTemplates: true } } },
  });

  const games = ['CS2', 'Valorant', 'LoL', 'Dota2'];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Pro <span className="text-[#00e676]">Players</span>
          </h1>
          <p className="text-gray-400">Browse all players available as collectible cards</p>
        </div>

        {/* Filters */}
        <div className="panel p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search players..."
            defaultValue={searchParams.q || ''}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const params = new URLSearchParams(window.location.search);
                params.set('q', (e.target as HTMLInputElement).value);
                window.location.href = `/players?${params.toString()}`;
              }
            }}
            className="input-field text-sm py-2 flex-1"
          />
          <select
            value={searchParams.game || ''}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              if (e.target.value) params.set('game', e.target.value);
              else params.delete('game');
              window.location.href = `/players?${params.toString()}`;
            }}
            className="input-field text-sm py-2 min-w-[150px]"
          >
            <option value="">All Games</option>
            {games.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {players.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.slug}`}
              className="panel p-5 card-hover group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0a3d2f] to-[#062a1f] flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                  {player.image ? (
                    <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#00e676] font-bold">{player.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-bold group-hover:text-[#00e676] transition-colors truncate">
                    {player.name}
                  </h3>
                  <p className="text-sm text-gray-400">{player.team}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-[#00e676]/10 text-[#00e676] px-2 py-0.5 rounded">
                      {player.game}
                    </span>
                    <span className="text-xs bg-[#0d4f3c] text-gray-400 px-2 py-0.5 rounded">
                      {player.role}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#0d4f3c] flex justify-between text-xs text-gray-500">
                <span>{player._count.cardTemplates} card variants</span>
                <span className="text-[#00e676] group-hover:text-[#00c853] transition-colors">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {players.length === 0 && (
          <div className="panel p-12 text-center">
            <p className="text-gray-400">No players found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
