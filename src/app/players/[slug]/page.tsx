import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRarityColor, getRarityBg } from '@/lib/utils';

export default async function PlayerProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const player = await prisma.player.findUnique({
    where: { slug: params.slug },
    include: {
      cardTemplates: {
        include: {
          _count: { select: { ownedCards: true } },
        },
      },
      performances: {
        orderBy: { weekStart: 'desc' },
        take: 5,
      },
    },
  });

  if (!player) notFound();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Player Header */}
        <div className="panel p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00e676]/5 to-transparent" />
          <div className="relative flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0a3d2f] to-[#062a1f] flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden">
              {player.image ? (
                <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#00e676] font-bold">{player.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                {player.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-[#00e676] font-medium">{player.team}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300">{player.role}</span>
                <span className="text-gray-500">•</span>
                <span className="bg-[#00e676]/10 text-[#00e676] text-xs px-2 py-1 rounded">
                  {player.game}
                </span>
                {player.country && (
                  <span className="text-sm">{player.country}</span>
                )}
              </div>
              {player.description && (
                <p className="text-gray-400 leading-relaxed">{player.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card Variants */}
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold text-white mb-4">Card Variants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {player.cardTemplates.map((template) => (
              <div key={template.id} className={`panel p-4 border-l-3 card-${template.rarity.toLowerCase()}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${getRarityBg(template.rarity)} rarity-${template.rarity}`}>
                    {template.rarity}
                  </span>
                  <span className="text-xs text-gray-500">{template.season}</span>
                </div>
                <p className="text-white font-bold text-sm">{template.season} Edition</p>
                <p className="text-xs text-gray-500 mt-1">
                  Owned: {template._count.ownedCards}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Performance */}
        {player.performances.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold text-white mb-4">Recent Performance</h2>
            <div className="panel overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#0d4f3c]">
                    <th className="text-left text-xs text-gray-400 p-3">Week</th>
                    <th className="text-right text-xs text-gray-400 p-3">Kills</th>
                    <th className="text-right text-xs text-gray-400 p-3">Deaths</th>
                    <th className="text-right text-xs text-gray-400 p-3">Assists</th>
                    <th className="text-right text-xs text-gray-400 p-3">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {player.performances.map((perf) => (
                    <tr key={perf.id} className="border-b border-[#0d4f3c]/50">
                      <td className="p-3 text-sm text-gray-300">
                        {new Date(perf.weekStart).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right text-sm text-gray-300">{perf.kills}</td>
                      <td className="p-3 text-right text-sm text-gray-300">{perf.deaths}</td>
                      <td className="p-3 text-right text-sm text-gray-300">{perf.assists}</td>
                      <td className="p-3 text-right text-sm text-[#00e676] font-mono">{perf.rating.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Link href="/players" className="text-[#00e676] hover:text-[#00c853] text-sm transition-colors">
          ← Back to all players
        </Link>
      </div>
    </div>
  );
}
