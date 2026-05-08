'use client';

import { useState } from 'react';
import type { User, OwnedCard, TeamLineup } from '@prisma/client';
import { ROLES } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface TeamBuilderProps {
  user: User & {
    ownedCards: (OwnedCard & {
      cardTemplate: { player: { id: string; name: string; team: string; role: string; game: string; image: string | null } };
    })[];
    teamLineups: (TeamLineup & {
      slots: { id: string; role: string; ownedCard: OwnedCard & { cardTemplate: { player: any } } }[];
    })[];
  };
  ownedCards: TeamBuilderProps['user']['ownedCards'];
  lineups: TeamBuilderProps['user']['teamLineups'];
}

export default function TeamBuilder({ user, ownedCards, lineups }: TeamBuilderProps) {
  const router = useRouter();
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({
    Captain: '',
    Flex: '',
    Entry: '',
    Support: '',
    AWP: '',
  });
  const [teamName, setTeamName] = useState('My Team');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const getCardById = (id: string) => ownedCards.find(c => c.id === id);

  const handleSelectCard = (role: string, cardId: string) => {
    setSelectedRoles(prev => ({ ...prev, [role]: cardId }));
  };

  const handleSave = async () => {
    const filled = Object.entries(selectedRoles).filter(([, v]) => v);
    if (filled.length === 0) {
      setMessage('Select at least one player');
      return;
    }

    // Check for duplicates
    const ids = Object.values(selectedRoles).filter(Boolean);
    if (new Set(ids).size !== ids.length) {
      setMessage('Cannot use the same card twice');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/team/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamName,
          slots: Object.entries(selectedRoles)
            .filter(([, cardId]) => cardId)
            .map(([role, cardId]) => ({ role, ownedCardId: cardId })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || 'Failed to save');
      } else {
        setMessage('Team saved!');
        router.refresh();
      }
    } catch {
      setMessage('An error occurred');
    }
    setSaving(false);
  };

  const getScore = () => {
    return Object.values(selectedRoles)
      .filter(Boolean)
      .reduce((acc, cardId) => {
        const card = getCardById(cardId);
        const rarityBonus = { Common: 1, Rare: 3, Epic: 5, Legendary: 10, Unique: 20 };
        return acc + (rarityBonus[card?.rarity as keyof typeof rarityBonus] || 1);
      }, 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Team Preview */}
      <div className="lg:col-span-2">
        <div className="panel p-6 mb-6">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="bg-transparent text-white font-display text-xl font-bold w-full mb-6 border-b border-[#0d4f3c] pb-3 focus:outline-none focus:border-[#00e676]/50"
            placeholder="Team Name"
          />

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {ROLES.map((role) => {
              const cardId = selectedRoles[role];
              const card = cardId ? getCardById(cardId) : null;

              return (
                <div key={role} className="text-center">
                  <div className="text-xs text-[#00e676] font-bold mb-2 font-display">{role}</div>
                  {card ? (
                    <div className={`panel p-3 border-l-3 card-${card.rarity.toLowerCase()} cursor-pointer`} onClick={() => handleSelectCard(role, '')}>
                      <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-[#0a3d2f] flex items-center justify-center overflow-hidden">
                        {card.cardTemplate.player.image ? (
                          <img src={card.cardTemplate.player.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[#00e676] font-bold">{card.cardTemplate.player.name.charAt(0)}</span>
                        )}
                      </div>
                      <p className="text-white text-xs font-bold truncate">{card.cardTemplate.player.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{card.cardTemplate.player.team}</p>
                    </div>
                  ) : (
                    <div className="panel p-3 border-2 border-dashed border-[#0d4f3c] min-h-[80px] flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Empty</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Team Score: <span className="text-[#ffaa00] font-bold font-mono">{getScore()}</span>
            </div>
            <div className="flex gap-3">
              {message && (
                <span className={`text-sm ${message.includes('saved') ? 'text-[#00e676]' : 'text-red-400'}`}>
                  {message}
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary text-sm py-2 px-6 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Team'}
              </button>
            </div>
          </div>
        </div>

        {/* Saved lineups */}
        {lineups.length > 0 && (
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-4">Saved Lineups</h3>
            <div className="space-y-3">
              {lineups.map((lineup) => (
                <div key={lineup.id} className="panel p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm">{lineup.name}</h4>
                    <p className="text-xs text-gray-400">{lineup.slots.length} players • Score: {lineup.totalScore}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(lineup.updatedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Selection */}
      <div className="panel p-6">
        <h3 className="font-display text-lg font-bold text-white mb-4">Your Cards</h3>
        <p className="text-xs text-gray-400 mb-4">Click a card to assign it to a role slot</p>

        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {ownedCards.map((card) => {
            const player = card.cardTemplate.player;
            const isSelected = Object.values(selectedRoles).includes(card.id);

            return (
              <div key={card.id} className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected ? 'bg-[#00e676]/10 border-[#00e676]/30' : 'panel hover:border-[#00e676]/20'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#0a3d2f] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {player.image ? (
                      <img src={player.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#00e676] font-bold text-sm">{player.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-bold truncate">{player.name}</p>
                    <p className="text-xs text-gray-400 truncate">{player.team} • {player.role}</p>
                  </div>
                  <span className={`text-xs font-mono rarity-${card.rarity}`}>{card.rarity}</span>
                </div>

                {/* Role buttons */}
                <div className="flex gap-1 mt-2 flex-wrap">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleSelectCard(role, card.id)}
                      className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                        selectedRoles[role] === card.id
                          ? 'bg-[#00e676] text-[#040f0a] font-bold'
                          : 'bg-[#0d4f3c] text-gray-400 hover:text-white'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {ownedCards.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">
              No cards yet. <a href="/packs" className="text-[#00e676]">Open packs</a> to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
