import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PackCard from '@/components/cards/PackCard';

export default async function PacksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login?callbackUrl=/packs');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { stats: true },
  });
  if (!user) redirect('/login');

  const packs = await prisma.pack.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  });

  const packCounts = await prisma.pack.findMany({
    where: { isActive: true },
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Card <span className="text-[#00e676]">Packs</span>
          </h1>
          <p className="text-gray-400">Open packs to discover new player cards</p>
        </div>

        {/* User balance/info */}
        <div className="panel p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-gray-400">Cards Owned</div>
              <div className="text-xl font-bold text-white">{user.stats?.totalCards || 0}</div>
            </div>
            <div className="w-px h-10 bg-[#0d4f3c]" />
            <div>
              <div className="text-xs text-gray-400">Packs Opened</div>
              <div className="text-xl font-bold text-[#4a9eff]">{user.stats?.packsOpened || 0}</div>
            </div>
          </div>
          <Link href="/collection" className="btn-secondary text-sm py-2 px-4">
            View Collection
          </Link>
        </div>

        {/* Pack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {packs.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>

        {/* Rarity Info */}
        <div className="panel p-6 mt-12 max-w-4xl mx-auto">
          <h3 className="font-display text-lg font-bold text-white mb-4">Rarity Distribution</h3>
          <div className="space-y-3">
            {[
              { name: 'Common', chance: '70%', color: 'bg-rarity-common', desc: 'Base cards for every player' },
              { name: 'Rare', chance: '20%', color: 'bg-rarity-rare', desc: 'Enhanced cards with special artwork' },
              { name: 'Epic', chance: '8%', color: 'bg-rarity-epic', desc: 'Premium cards with unique designs' },
              { name: 'Legendary', chance: '2%', color: 'bg-rarity-legendary', desc: 'Ultra-rare cards of top performers' },
            ].map((r) => (
              <div key={r.name} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${r.color}`} />
                <div className="flex-1">
                  <span className="text-white font-medium text-sm">{r.name}</span>
                  <span className="text-gray-400 text-xs ml-2">{r.desc}</span>
                </div>
                <span className="text-sm font-mono text-gray-300">{r.chance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
