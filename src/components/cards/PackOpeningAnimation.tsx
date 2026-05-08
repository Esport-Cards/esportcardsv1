'use client';

import { useState, useEffect } from 'react';

interface CardResult {
  id: string;
  rarity: string;
  serialNumber: string;
  cardTemplate: {
    season: string;
    player: {
      name: string;
      team: string;
      role: string;
      game: string;
      image: string | null;
    };
  };
}

export default function PackOpeningAnimation({
  cards,
  onClose,
}: {
  cards: CardResult[];
  onClose: () => void;
}) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [phase, setPhase] = useState<'opening' | 'revealing' | 'done'>('opening');

  useEffect(() => {
    // Phase 1: Pack opening animation
    const timer1 = setTimeout(() => {
      setPhase('revealing');
      revealNext(0);
    }, 1500);

    return () => clearTimeout(timer1);
  }, []);

  const revealNext = (index: number) => {
    if (index >= cards.length) {
      setShowAll(true);
      setPhase('done');
      return;
    }

    setRevealed(prev => [...prev, index]);

    if (index < cards.length - 1) {
      setTimeout(() => revealNext(index + 1), 600);
    } else {
      setTimeout(() => {
        setShowAll(true);
        setPhase('done');
      }, 800);
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'border-[#ffaa00] shadow-[#ffaa00]/30';
      case 'Epic': return 'border-[#b44aff] shadow-[#b44aff]/30';
      case 'Rare': return 'border-[#4a9eff] shadow-[#4a9eff]/30';
      case 'Unique': return 'border-[#ff4444] shadow-[#ff4444]/30';
      default: return 'border-[#b0b0b0] shadow-[#b0b0b0]/20';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'from-amber-900/20 to-yellow-900/20';
      case 'Epic': return 'from-purple-900/20 to-purple-700/20';
      case 'Rare': return 'from-blue-900/20 to-blue-700/20';
      case 'Unique': return 'from-red-900/20 to-red-700/20';
      default: return 'from-gray-800/20 to-gray-700/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={phase === 'done' ? onClose : undefined}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Pack opening phase */}
        {phase === 'opening' && (
          <div className="text-center animate-pack-open">
            <div className="w-48 h-56 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#0a3d2f] to-[#062a1f] border-2 border-[#00e676]/30 flex items-center justify-center">
              <svg className="w-20 h-20 text-[#00e676]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-[#00e676] font-display text-xl animate-pulse">Opening pack...</p>
          </div>
        )}

        {/* Card revealing phase */}
        {phase !== 'opening' && (
          <>
            <h2 className="font-display text-2xl font-bold text-white text-center mb-8">
              {phase === 'revealing' ? 'Revealing Cards...' : 'Pack Opened!'}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {cards.map((card, i) => (
                <div
                  key={card.id}
                  className={`relative transition-all duration-500 ${
                    revealed.includes(i) || showAll
                      ? 'opacity-100 translate-y-0 animate-card-reveal'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ animationDelay: revealed.includes(i) ? '0s' : 'none' }}
                >
                  <div className={`panel p-3 border-2 bg-gradient-to-br ${getRarityBg(card.rarity)} ${getRarityBorder(card.rarity)} shadow-lg`}>
                    {/* Card image/avatar */}
                    <div className="aspect-[3/4] rounded-lg bg-[#062a1f]/50 flex items-center justify-center mb-2 overflow-hidden">
                      {card.cardTemplate.player.image ? (
                        <img
                          src={card.cardTemplate.player.image}
                          alt={card.cardTemplate.player.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-[#00e676]/60">
                          {card.cardTemplate.player.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Card info */}
                    <div className="text-center">
                      <p className="text-white font-bold text-xs truncate">{card.cardTemplate.player.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{card.cardTemplate.player.team}</p>
                      <span className={`text-[10px] font-mono rarity-${card.rarity}`}>
                        {card.rarity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {phase === 'done' && (
              <div className="text-center mt-8 space-y-4">
                <p className="text-gray-300 text-sm">
                  {cards.length} cards added to your collection!
                </p>
                <button onClick={onClose} className="btn-primary px-8 py-3">
                  View Collection
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
