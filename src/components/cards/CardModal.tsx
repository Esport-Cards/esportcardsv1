'use client';

import type { OwnedCard } from '@prisma/client';

interface CardWithRelations extends OwnedCard {
  cardTemplate: {
    id: string;
    season: string;
    rarity: string;
    image: string | null;
    player: {
      id: string;
      name: string;
      team: string;
      teamCode: string;
      role: string;
      game: string;
      image: string | null;
      description: string | null;
    };
  };
}

export default function CardModal({
  card,
  onClose,
}: {
  card: CardWithRelations;
  onClose: () => void;
}) {
  const p = card.cardTemplate.player;
  const rarity = card.rarity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative panel p-0 max-w-lg w-full overflow-hidden border-l-4 card-${rarity.toLowerCase()}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card artwork area */}
        <div className={`h-48 bg-gradient-to-br ${
          rarity === 'Legendary' ? 'from-amber-900/30 to-yellow-900/30' :
          rarity === 'Epic' ? 'from-purple-900/30 to-purple-700/30' :
          rarity === 'Rare' ? 'from-blue-900/30 to-blue-700/30' :
          rarity === 'Unique' ? 'from-red-900/30 to-red-700/30' :
          'from-gray-800/30 to-gray-700/30'
        } flex items-center justify-center`}>
          {p.image ? (
            <img src={p.image} alt={p.name} className="h-32 w-32 object-cover rounded-xl" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#0a3d2f] flex items-center justify-center text-4xl font-bold text-[#00e676]">
              {p.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold rarity-${rarity}`}>
            {rarity}
          </div>
        </div>

        {/* Card info */}
        <div className="p-6">
          <h2 className="font-display text-2xl font-bold text-white mb-1">{p.name}</h2>
          <p className="text-[#00e676] text-sm mb-4">{p.team} • {p.role} • {p.game}</p>

          {p.description && (
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{p.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="panel p-3 text-center">
              <div className="text-xs text-gray-400">Season</div>
              <div className="text-white font-bold text-sm">{card.cardTemplate.season}</div>
            </div>
            <div className="panel p-3 text-center">
              <div className="text-xs text-gray-400">Serial</div>
              <div className="text-[#00e676] font-mono text-sm">{card.serialNumber}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-primary w-full py-2 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
