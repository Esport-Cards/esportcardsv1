import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AdminCardForm from '@/components/admin/AdminCardForm';

export default async function AdminCardsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login?callbackUrl=/admin/cards');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.isAdmin) redirect('/dashboard');

  const cards = await prisma.cardTemplate.findMany({
    include: { player: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Manage <span className="text-[#00e676]">Cards</span>
            </h1>
            <p className="text-gray-400">Create card templates with rarities</p>
          </div>
          <a href="/admin" className="text-sm text-[#00e676] hover:text-[#00c853]">← Back to Admin</a>
        </div>

        <div className="panel p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-white mb-4">Add Card Template</h2>
          <AdminCardForm />
        </div>

        <div className="panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0d4f3c]">
                <th className="text-left text-xs text-gray-400 p-3">Player</th>
                <th className="text-left text-xs text-gray-400 p-3">Rarity</th>
                <th className="text-left text-xs text-gray-400 p-3">Season</th>
                <th className="text-right text-xs text-gray-400 p-3">Design</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr key={card.id} className="border-b border-[#0d4f3c]/50">
                  <td className="p-3 text-white text-sm">{card.player.name}</td>
                  <td className="p-3">
                    <span className={`text-xs font-mono rarity-${card.rarity}`}>{card.rarity}</span>
                  </td>
                  <td className="p-3 text-gray-400 text-sm">{card.season}</td>
                  <td className="p-3 text-right text-gray-500 text-xs">{card.design}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
