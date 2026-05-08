import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AdminPlayerForm from '@/components/admin/AdminPlayerForm';

export default async function AdminPlayersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login?callbackUrl=/admin/players');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.isAdmin) redirect('/dashboard');

  const players = await prisma.player.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { cardTemplates: true } } },
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Manage <span className="text-[#00e676]">Players</span>
            </h1>
            <p className="text-gray-400">Add and manage esports player profiles</p>
          </div>
          <a href="/admin" className="text-sm text-[#00e676] hover:text-[#00c853]">← Back to Admin</a>
        </div>

        {/* Add Player Form */}
        <div className="panel p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-white mb-4">Add New Player</h2>
          <AdminPlayerForm />
        </div>

        {/* Players List */}
        <div className="panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0d4f3c]">
                <th className="text-left text-xs text-gray-400 p-3">Name</th>
                <th className="text-left text-xs text-gray-400 p-3">Team</th>
                <th className="text-left text-xs text-gray-400 p-3">Role</th>
                <th className="text-left text-xs text-gray-400 p-3">Game</th>
                <th className="text-right text-xs text-gray-400 p-3">Cards</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b border-[#0d4f3c]/50 hover:bg-white/5">
                  <td className="p-3 text-white text-sm font-medium">{player.name}</td>
                  <td className="p-3 text-gray-400 text-sm">{player.team}</td>
                  <td className="p-3 text-gray-400 text-sm">{player.role}</td>
                  <td className="p-3 text-sm">
                    <span className="bg-[#00e676]/10 text-[#00e676] px-2 py-0.5 rounded text-xs">{player.game}</span>
                  </td>
                  <td className="p-3 text-right text-gray-300 text-sm">{player._count.cardTemplates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
