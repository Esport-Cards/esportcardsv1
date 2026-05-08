'use client';

import { useState } from 'react';
import type { OwnedCard } from '@prisma/client';
import CardModal from './CardModal';

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
    };
  };
}

export default function CardGrid({ cards }: { cards: CardWithRelations[] }) {
  const [selectedCard, setSelectedCard] = useState<CardWithRelations | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className={`panel p-5 card-hover cursor-pointer border-l-4 card-${card.rarity.toLowerCase()}`}
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0a3d2f] to-[#062a1f] flex items-center justify-center text-lg font-bold text-[#00e676] flex-shrink-0 overflow-hidden">
                  {card.cardTemplate.player.image ? (
                    <img
                      src={card.cardTemplate.player.image}
                      alt={card.cardTemplate.player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    card.cardTemplate.player.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-bold text-sm truncate">{card.cardTemplate.player.name}</h3>
                  <p className="text-xs text-gray-400">{card.cardTemplate.player.team}</p>
                </div>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded rarity-${card.rarity}`}>
                {card.rarity}
              </span>
            </div>

            {/* Card details */}
            <div className="space-y-1.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Game</span>
                <span className="text-gray-300">{card.cardTemplate.player.game}</span>
              </div>
              <div className="flex justify-between">
                <span>Role</span>
                <span className="text-gray-300">{card.cardTemplate.player.role}</span>
              </div>
              <div className="flex justify-between">
                <span>Season</span>
                <span className="text-gray-300">{card.cardTemplate.season}</span>
              </div>
              <div className="flex justify-between">
                <span>Serial</span>
                <span className="text-[#00e676] font-mono text-xs">{card.serialNumber}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Card detail modal */}
      {selectedCard && (
        <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </>
  );
}
