import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { rarity?: string; game?: string; minPrice?: string; maxPrice?: string };
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;

  const where: any = { isActive: true, buyerId: null };

  if (searchParams.rarity) where.ownedCard = { rarity: searchParams.rarity };
  if (searchParams.minPrice) where.price = { gte: parseInt(searchParams.minPrice) * 100 };
  if (searchParams.maxPrice) {
    where.price = { ...where.price, lte: parseInt(searchParams.maxPrice) * 100 };
  }
  if (searchParams.game) {
    where.ownedCard = {
      ...where.ownedCard,
      cardTemplate: { player: { game: searchParams.game } },
    };
  }

  const listings = await prisma.marketplaceListing.findMany({
    where,
    include: {
      ownedCard: {
        include: { cardTemplate: { include: { player: true } } },
      },
      seller: { select: { id: true, name: true } },
    },
    orderBy: { listedAt: 'desc' },
  });

  const rarities = ['Common', 'Rare', 'Epic', 'Legendary', 'Unique'];
  const games = ['CS2', 'Valorant', 'LoL', 'Dota2'];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            <span className="text-[#00e676]">Market</span>place
          </h1>
          <p className="text-gray-400">Buy and sell cards with other collectors</p>
        </div>

        {/* Filters */}
        <div className="panel p-4 mb-6 flex flex-col md:flex-row gap-4 flex-wrap">
          <select
            value={searchParams.rarity || ''}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              e.target.value ? params.set('rarity', e.target.value) : params.delete('rarity');
              window.location.href = `/marketplace?${params.toString()}`;
            }}
            className="input-field text-sm py-2 min-w-[130px]"
          >
            <option value="">All Rarities</option>
            {rarities.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={searchParams.game || ''}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              e.target.value ? params.set('game', e.target.value) : params.delete('game');
              window.location.href = `/marketplace?${params.toString()}`;
            }}
            className="input-field text-sm py-2 min-w-[130px]"
          >
            <option value="">All Games</option>
            {games.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min $"
            defaultValue={searchParams.minPrice || ''}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const params = new URLSearchParams(window.location.search);
                (e.target as HTMLInputElement).value ? params.set('minPrice', (e.target as HTMLInputElement).value) : params.delete('minPrice');
                window.location.href = `/marketplace?${params.toString()}`;
              }
            }}
            className="input-field text-sm py-2 w-[100px]"
          />

          <input
            type="number"
            placeholder="Max $"
            defaultValue={searchParams.maxPrice || ''}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const params = new URLSearchParams(window.location.search);
                (e.target as HTMLInputElement).value ? params.set('maxPrice', (e.target as HTMLInputElement).value) : params.delete('maxPrice');
                window.location.href = `/marketplace?${params.toString()}`;
              }
            }}
            className="input-field text-sm py-2 w-[100px]"
          />

          <span className="text-sm text-gray-500 flex items-center">
            {listings.length} listings
          </span>
        </div>

        {user ? (
          <MarketplaceGrid listings={listings} currentUserId={user.id} />
        ) : (
          <div className="panel p-8 text-center">
            <p className="text-gray-400 mb-4">Please log in to buy cards</p>
            <Link href="/login?callbackUrl=/marketplace" className="btn-primary text-sm px-6 py-2 inline-block">
              Login
            </Link>
          </div>
        )}

        {listings.length === 0 && (
          <div className="panel p-12 text-center">
            <p className="text-gray-400">No listings found. Check back later or adjust filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
