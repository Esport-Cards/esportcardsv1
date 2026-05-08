import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);

  // Get top users by total score
  const topUsers = await prisma.userStats.findMany({
    orderBy: { totalScore: 'desc' },
    take: 50,
    include: {
      user: {
        include: {
          teamLineups: {
            take: 1,
            orderBy: { totalScore: 'desc' },
            include: {
              slots: true,
            },
          },
        },
      },
    },
  });

  const currentUserStats = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true },
      })
    : null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Weekly <span className="text-[#00e676]">Leaderboard</span>
          </h1>
          <p className="text-gray-400">Top collectors ranked by team score</p>
        </div>

        {/* Podium for top 3 */}
        {topUsers.length >= 3 && (
          <div className="flex justify-center items-end gap-4 mb-12 pb-8">
            <div className="text-center w-36">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-[#4a9eff]/20 border-2 border-[#4a9eff] flex items-center justify-center text-xl font-bold text-[#4a9eff]">
                {topUsers[1].user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="bg-[#4a9eff]/10 border border-[#4a9eff]/30 rounded-t-2xl p-4 pt-6">
                <div className="font-display text-[#4a9eff] font-bold">#2</div>
                <div className="text-white font-bold text-sm mt-1 truncate">
                  {topUsers[1].user.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {topUsers[1].totalScore} pts
                </div>
              </div>
            </div>

            <div className="text-center w-40 -mb-4">
              <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-[#ffaa00]/20 border-2 border-[#ffaa00] flex items-center justify-center text-2xl font-bold text-[#ffaa00]">
                {topUsers[0].user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="bg-[#ffaa00]/10 border border-[#ffaa00]/30 rounded-t-2xl p-4 pt-6">
                <div className="font-display text-[#ffaa00] font-bold text-lg">#1</div>
                <div className="text-white font-bold mt-1 truncate">
                  {topUsers[0].user.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {topUsers[0].totalScore} pts
                </div>
              </div>
            </div>

            <div className="text-center w-36">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-[#b44aff]/20 border-2 border-[#b44aff] flex items-center justify-center text-xl font-bold text-[#b44aff]">
                {topUsers[2].user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="bg-[#b44aff]/10 border border-[#b44aff]/30 rounded-t-2xl p-4 pt-6">
                <div className="font-display text-[#b44aff] font-bold">#3</div>
                <div className="text-white font-bold text-sm mt-1 truncate">
                  {topUsers[2].user.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {topUsers[2].totalScore} pts
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#0d4f3c]">
                  <th className="text-left text-xs text-gray-400 font-medium p-4">Rank</th>
                  <th className="text-left text-xs text-gray-400 font-medium p-4">Player</th>
                  <th className="text-left text-xs text-gray-400 font-medium p-4">Cards</th>
                  <th className="text-left text-xs text-gray-400 font-medium p-4">Packs</th>
                  <th className="text-right text-xs text-gray-400 font-medium p-4">Score</th>
                </tr>
              </thead>

              <tbody>
                {topUsers.map((stat, i) => {
                  const isCurrentUser =
                    currentUserStats && stat.user.id === currentUserStats.id;

                  return (
                    <tr
                      key={stat.id}
                      className={`border-b border-[#0d4f3c]/50 ${
                        isCurrentUser ? 'bg-[#00e676]/5' : 'hover:bg-white/5'
                      } transition-colors`}
                    >
                      <td className="p-4 font-bold text-sm text-gray-400">
                        #{i + 1}
                      </td>
                      <td className="p-4 text-white text-sm">
                        {stat.user.name}
                        {isCurrentUser && ' (You)'}
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {stat.totalCards}
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {stat.packsOpened}
                      </td>
                      <td className="p-4 text-right font-bold text-[#ffaa00]">
                        {stat.totalScore}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {topUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No players on the leaderboard yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}