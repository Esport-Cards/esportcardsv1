import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AdminPerformanceForm from '@/components/admin/AdminPerformanceForm';

export default async function AdminPerformancesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login?callbackUrl=/admin/performances');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.isAdmin) redirect('/dashboard');

  const performances = await prisma.weeklyPerformance.findMany({
    take: 20,
    orderBy: { weekStart: 'desc' },
    include: { player: true, user: { select: { name: true } } },
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Manage <span className="text-[#00e676]">Performances</span>
            </h1>
            <p className="text-gray-400">Seed weekly performance stats</p>
          </div>
          <a href="/admin" className="text-sm text-[#00e676] hover:text-[#00c853]">← Back to Admin</a>
        </div>

        <div className="panel p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-white mb-4">Add Performance</h2>
          <AdminPerformanceForm />
        </div>

        <div className="panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0d4f3c]">
                <th className="text-left text-xs text-gray-400 p-3">Player</th>
                <th className="text-right text-xs text-gray-400 p-3">Kills</th>
                <th className="text-right text-xs text-gray-400 p-3">Deaths</th>
                <th className="text-right text-xs text-gray-400 p-3">Assists</th>
                <th className="text-right text-xs text-gray-400 p-3">Rating</th>
                <th className="text-left text-xs text-gray-400 p-3">Week</th>
              </tr>
            </thead>
            <tbody>
              {performances.map((perf) => (
                <tr key={perf.id} className="border-b border-[#0d4f3c]/50">
                  <td className="p-3 text-white text-sm">{perf.player.name}</td>
                  <td className="p-3 text-right text-gray-300 text-sm">{perf.kills}</td>
                  <td className="p-3 text-right text-gray-300 text-sm">{perf.deaths}</td>
                  <td className="p-3 text-right text-gray-300 text-sm">{perf.assists}</td>
                  <td className="p-3 text-right text-[#00e676] font-mono text-sm">{perf.rating.toFixed(2)}</td>
                  <td className="p-3 text-gray-500 text-xs">{new Date(perf.weekStart).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
