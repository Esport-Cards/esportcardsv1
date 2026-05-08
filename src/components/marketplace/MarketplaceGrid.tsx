'use client';

import { useState } from 'react';
import type { MarketplaceListing } from '@prisma/client';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ListingWithRelations extends MarketplaceListing {
  ownedCard: {
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
  };
  seller: { id: string; name: string | null };
}

export default function MarketplaceGrid({
  listings,
  currentUserId,
}: {
  listings: ListingWithRelations[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [buying, setBuying] = useState<string | null>(null);

  const handleBuy = async (listingId: string) => {
    if (!confirm('Are you sure you want to buy this card?')) return;

    setBuying(listingId);
    try {
      const res = await fetch('/api/marketplace/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Purchase failed');
      } else {
        alert('Card purchased successfully!');
        router.refresh();
      }
    } catch {
      alert('An error occurred');
    }
    setBuying(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {listings.map((listing) => {
        const card = listing.ownedCard;
        const player = card.cardTemplate.player;
        const isOwnListing = listing.seller.id === currentUserId;

        return (
          <div
            key={listing.id}
            className={`panel p-4 border-l-3 card-${card.rarity.toLowerCase()}`}
          >
            {/* Card preview */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#0a3d2f] flex items-center justify-center overflow-hidden flex-shrink-0">
                {player.image ? (
                  <img src={player.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#00e676] font-bold">{player.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-bold text-sm truncate">{player.name}</h3>
                <p className="text-xs text-gray-400">{player.team} • {player.role}</p>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded rarity-${card.rarity}`}>
                {card.rarity}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-400 mb-4">
              <div className="flex justify-between">
                <span>Game</span>
                <span className="text-gray-300">{player.game}</span>
              </div>
              <div className="flex justify-between">
                <span>Season</span>
                <span className="text-gray-300">{card.cardTemplate.season}</span>
              </div>
              <div className="flex justify-between">
                <span>Seller</span>
                <span className="text-gray-300 truncate max-w-[100px]">{listing.seller.name}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#0d4f3c]">
              <span className="text-[#00e676] font-display font-bold text-lg">
                {formatPrice(listing.price)}
              </span>
              <button
                onClick={() => handleBuy(listing.id)}
                disabled={isOwnListing || buying === listing.id}
                className={`text-xs px-4 py-1.5 rounded transition-colors ${
                  isOwnListing
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'btn-primary py-1.5 text-xs'
                }`}
              >
                {buying === listing.id ? 'Buying...' : isOwnListing ? 'Your Listing' : 'Buy Now'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
