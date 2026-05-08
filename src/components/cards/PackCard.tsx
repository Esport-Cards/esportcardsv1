'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Pack } from '@prisma/client';
import PackOpeningAnimation from './PackOpeningAnimation';

export default function PackCard({ pack }: { pack: Pack }) {
  const router = useRouter();
  const [opening, setOpening] = useState(false);
  const [openedCards, setOpenedCards] = useState<any[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleOpen = async () => {
    setOpening(true);
    try {
      const res = await fetch('/api/packs/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId: pack.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to open pack');
        setOpening(false);
        return;
      }

      setOpenedCards(data.cards);
      setShowAnimation(true);
    } catch (err) {
      alert('An error occurred');
      setOpening(false);
    }
  };

  const handleCloseAnimation = () => {
    setShowAnimation(false);
    setOpenedCards([]);
    setOpening(false);
    router.refresh();
  };

  return (
    <>
      <div className="panel p-8 text-center card-hover border-[#00e676]/10 hover:border-[#00e676]/30 transition-all flex flex-col">
        {/* Pack artwork */}
        <div className={`w-32 h-40 mx-auto mb-6 rounded-xl bg-gradient-to-br ${
          pack.name.includes('Elite') ? 'from-purple-600/30 to-purple-900/30' :
          pack.name.includes('Pro') ? 'from-blue-600/30 to-blue-900/30' :
          'from-gray-600/30 to-gray-900/30'
        } flex items-center justify-center border border-[#00e676]/20`}>
          <svg className="w-16 h-16 text-[#00e676]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>

        <h3 className="font-display font-bold text-white text-lg mb-2">{pack.name}</h3>
        <p className="text-sm text-gray-400 mb-4 flex-1">{pack.description}</p>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Cards</span>
            <span className="text-white">{pack.cardCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Price</span>
            <span className="text-[#00e676] font-bold">${(pack.price / 100).toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleOpen}
          disabled={opening}
          className="btn-primary w-full py-3 disabled:opacity-50"
        >
          {opening ? 'Opening...' : 'Open Pack'}
        </button>
      </div>

      {showAnimation && (
        <PackOpeningAnimation cards={openedCards} onClose={handleCloseAnimation} />
      )}
    </>
  );
}
