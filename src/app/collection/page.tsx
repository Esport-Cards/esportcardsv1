import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CardGrid from '@/components/cards/CardGrid';
import CollectionFilters from '@/components/cards/CollectionFilters';

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: { rarity?: string; game?: string; role?: string; q?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login?callbackUrl=/collection');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) redirect('/login');

  // Build filters
  const where: any = { ownerId: user.id };
  if (searchParams.rarity) where.rarity = searchParams.rarity;
  if (searchParams.q) {
    where.cardTemplate = {
      player: {
        name: { contains: searchParams.q, mode: 'insensitive' },
      },
    };
  }
  if (searchParams.game) {
    where.cardTemplate = {
      ...where.cardTemplate,
      player: { ...where.cardTemplate?.player, game: searchParams.game },
    };
  }
  if (searchParams.role) {
    where.cardTemplate = {
      ...where.cardTemplate,
      player: { ...where.cardTemplate?.player, role: searchParams.role },
    };
  }

  const cards = await prisma.ownedCard.findMany({
    where,
    include: {
      cardTemplate: {
        include: { player: true },
      },
    },
    orderBy: { mintedAt: 'desc' },
  });

  // Get filter options
  const rarities = ['Common', 'Rare', 'Epic', 'Legendary', 'Unique'];
  const games = ['CS2', 'Valorant', 'LoL', 'Dota2'];
  const roles = ['Captain', 'Flex', 'Entry', 'Support', 'AWP'];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            My <span className="text-[#00e676]">Collection</span>
          </h1>
          <p className="text-gray-400">Browse and manage your owned cards</p>
        </div>

        <CollectionFilters
          rarities={rarities}
          games={games}
          roles={roles}
          activeRarity={searchParams.rarity}
          activeGame={searchParams.game}
          activeRole={searchParams.role}
          query={searchParams.q || ''}
          totalCards={cards.length}
        />

        {cards.length > 0 ? (
          <CardGrid cards={cards} />
        ) : (
          <div className="panel p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00e676]/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#00e676]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">No cards found</h3>
            <p className="text-gray-400 mb-6">
              {searchParams.q || searchParams.rarity || searchParams.game || searchParams.role
                ? 'Try adjusting your filters'
                : "You haven't collected any cards yet. Open a pack to get started!"}
            </p>
            <a href="/packs" className="btn-primary inline-block text-sm px-6 py-2">
              Open Packs
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
