import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login?callbackUrl=/dashboard');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      stats: true,
      ownedCards: { take: 3, orderBy: { mintedAt: 'desc' }, include: { cardTemplate: { include: { player: true } } } },
      packOpenings: { take: 3, orderBy: { openedAt: 'desc' }, include: { pack: true } },
    },
  });

  if (!user) redirect('/login');

  const stats = user.stats || {
    totalCards: 0,
    packsOpened: 0,
    currentRank: 0,
    totalScore: 0,
  };

  // Get user rank
  const rank = await prisma.$queryRaw<{ rank: bigint }[]>`
    SELECT COUNT(*) + 1 as rank FROM user_stats
    WHERE total_score > ${stats.totalScore}
  `;
  const currentRank = Number(rank[0]?.rank || 0);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="panel p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00e676]/5 to-transparent" />
          <div className="relative">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, <span className="text-[#00e676] neon-glow">{user.name}</span>
            </h1>
            <p className="text-gray-400">
              Manage your collection, open new packs, and climb the leaderboard.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="panel p-6 text-center">
            <div className="text-3xl font-display font-bold text-[#00e676] mb-1">
              {stats.totalCards}
            </div>
            <div className="text-sm text-gray-400">Total Cards</div>
          </div>
          <div className="panel p-6 text-center">
            <div className="text-3xl font-display font-bold text-[#4a9eff] mb-1">
              {stats.packsOpened}
            </div>
            <div className="text-sm text-gray-400">Packs Opened</div>
          </div>
          <div className="panel p-6 text-center">
            <div className="text-3xl font-display font-bold text-[#ffaA00] mb-1">
              #{currentRank || '--'}
            </div>
            <div className="text-sm text-gray-400">Current Rank</div>
          </div>
          <div className="panel p-6 text-center">
            <div className="text-3xl font-display font-bold text-[#b44aff] mb-1">
              {stats.totalScore}
            </div>
            <div className="text-sm text-gray-400">Total Score</div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="font-display text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <Link href="/collection" className="panel p-6 card-hover group text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#00e676]/10 flex items-center justify-center group-hover:bg-[#00e676]/20 transition-colors">
              <svg className="w-8 h-8 text-[#00e676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-white mb-2">My Collection</h3>
            <p className="text-sm text-gray-400">Browse and manage your owned cards</p>
          </Link>

          <Link href="/packs" className="panel p-6 card-hover group text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#4a9eff]/10 flex items-center justify-center group-hover:bg-[#4a9eff]/20 transition-colors">
              <svg className="w-8 h-8 text-[#4a9eff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-white mb-2">Open Packs</h3>
            <p className="text-sm text-gray-400">Discover new cards and expand your collection</p>
          </Link>

          <Link href="/marketplace" className="panel p-6 card-hover group text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#b44aff]/10 flex items-center justify-center group-hover:bg-[#b44aff]/20 transition-colors">
              <svg className="w-8 h-8 text-[#b44aff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H2m5 8a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-white mb-2">Marketplace</h3>
            <p className="text-sm text-gray-400">Buy and sell cards with other collectors</p>
          </Link>
        </div>

        {/* Recent Cards */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-white">Recent Cards</h2>
            <Link href="/collection" className="text-sm text-[#00e676] hover:text-[#00c853] transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.ownedCards.length > 0 ? (
              user.ownedCards.map((ownedCard) => (
                <div key={ownedCard.id} className={`panel p-4 card-hover border-l-3 card-${ownedCard.rarity.toLowerCase()}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0a3d2f] to-[#062a1f] flex items-center justify-center text-lg flex-shrink-0">
                      {ownedCard.cardTemplate.player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-white font-bold text-sm truncate">{ownedCard.cardTemplate.player.name}</h4>
                      <p className="text-xs text-gray-400">{ownedCard.cardTemplate.player.team}</p>
                    </div>
                    <span className={`text-xs font-mono px-2 py-1 rounded rarity-${ownedCard.rarity}`}>
                      {ownedCard.rarity}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full panel p-8 text-center">
                <p className="text-gray-400 mb-4">You haven't opened any packs yet!</p>
                <Link href="/packs" className="btn-primary text-sm px-6 py-2 inline-block">
                  Open Your First Pack
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Pack Openings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-white">Recent Openings</h2>
            <Link href="/packs" className="text-sm text-[#00e676] hover:text-[#00c853] transition-colors">
              Open more →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {user.packOpenings.length > 0 ? (
              user.packOpenings.map((opening) => (
                <div key={opening.id} className="panel p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold text-sm">{opening.pack.name}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(opening.openedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{opening.cardIds.length} cards revealed</p>
                </div>
              ))
            ) : (
              <div className="col-span-full panel p-8 text-center">
                <p className="text-gray-400">No pack openings yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
