import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import TeamBuilder from '@/components/team/TeamBuilder';

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login?callbackUrl=/team');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      ownedCards: {
        include: { cardTemplate: { include: { player: true } } },
      },
      teamLineups: {
        include: {
          slots: {
            include: {
              ownedCard: {
                include: {
                  cardTemplate: {
                    include: {
                      player: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) redirect('/login');

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Team <span className="text-[#00e676]">Builder</span>
          </h1>
          <p className="text-gray-400">
            Build your 5-player lineup from cards you own
          </p>
        </div>

        <TeamBuilder
          user={user}
          ownedCards={user.ownedCards}
          lineups={user.teamLineups}
        />
      </div>
    </div>
  );
}