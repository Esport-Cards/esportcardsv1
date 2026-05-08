import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login?callbackUrl=/profile');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      stats: true,
      ownedCards: { take: 6, orderBy: { mintedAt: 'desc' } },
      packOpenings: { take: 5, orderBy: { openedAt: 'desc' } },
      teamLineups: { take: 3, orderBy: { updatedAt: 'desc' } },
    },
  });

  if (!user) redirect('/login');

  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            My <span className="text-[#00e676]">Profile</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="panel p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00e676]/20 to-[#0a3d2f] flex items-center justify-center text-3xl font-bold text-[#00e676]">
                {initials}
              </div>
              <h2 className="font-display text-xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-sm text-gray-400 mb-4">{user.email}</p>
              <p className="text-xs text-gray-500 mb-6">
                Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-[#00e676]">{user.stats?.totalCards || 0}</div>
                  <div className="text-xs text-gray-400">Cards</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[#4a9eff]">{user.stats?.packsOpened || 0}</div>
                  <div className="text-xs text-gray-400">Packs</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[#ffaa00]">#{user.stats?.currentRank || '--'}</div>
                  <div className="text-xs text-gray-400">Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[#b44aff]">{user.stats?.totalScore || 0}</div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Cards */}
            <div className="panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-white">Recent Cards</h3>
                <Link href="/collection" className="text-xs text-[#00e676] hover:text-[#00c853]">
                  View All →
                </Link>
              </div>
              {user.ownedCards.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {user.ownedCards.map((card) => (
                    <div key={card.id} className={`panel p-3 border-l-3 card-${card.rarity.toLowerCase()}`}>
                      <p className="text-white text-xs font-bold truncate">{card.cardTemplate.player.name}</p>
                      <p className="text-[10px] text-gray-400">{card.rarity}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No cards yet. <Link href="/packs" className="text-[#00e676]">Open a pack!</Link></p>
              )}
            </div>

            {/* Recent Lineups */}
            <div className="panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-white">Recent Lineups</h3>
                <Link href="/team" className="text-xs text-[#00e676] hover:text-[#00c853]">
                  Build New →
                </Link>
              </div>
              {user.teamLineups.length > 0 ? (
                <div className="space-y-3">
                  {user.teamLineups.map((lineup) => (
                    <div key={lineup.id} className="flex items-center justify-between p-3 bg-[#062a1f]/50 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-bold">{lineup.name}</p>
                        <p className="text-xs text-gray-400">{lineup._count?.slots || 0} players • Score: {lineup.totalScore}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(lineup.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No lineups yet. <Link href="/team" className="text-[#00e676]">Build one!</Link></p>
              )}
            </div>

            {/* Recent Openings */}
            <div className="panel p-6">
              <h3 className="font-display text-lg font-bold text-white mb-4">Recent Pack Openings</h3>
              {user.packOpenings.length > 0 ? (
                <div className="space-y-3">
                  {user.packOpenings.map((opening) => (
                    <div key={opening.id} className="flex items-center justify-between p-3 bg-[#062a1f]/50 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-bold">{opening.pack.name}</p>
                        <p className="text-xs text-gray-400">{opening.cardIds.length} cards</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(opening.openedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No pack openings yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
