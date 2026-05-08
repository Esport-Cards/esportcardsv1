'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function CollectionFilters({
  rarities,
  games,
  roles,
  activeRarity,
  activeGame,
  activeRole,
  query,
  totalCards,
}: {
  rarities: string[];
  games: string[];
  roles: string[];
  activeRarity?: string;
  activeGame?: string;
  activeRole?: string;
  query: string;
  totalCards: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/collection?${params.toString()}`);
  };

  const clearAll = () => {
    router.push('/collection');
  };

  return (
    <div className="panel p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search player name..."
            defaultValue={query}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateFilter('q', (e.target as HTMLInputElement).value || null);
              }
            }}
            className="input-field text-sm py-2"
          />
        </div>

        {/* Rarity filter */}
        <select
          value={activeRarity || ''}
          onChange={(e) => updateFilter('rarity', e.target.value || null)}
          className="input-field text-sm py-2 min-w-[130px]"
        >
          <option value="">All Rarities</option>
          {rarities.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* Game filter */}
        <select
          value={activeGame || ''}
          onChange={(e) => updateFilter('game', e.target.value || null)}
          className="input-field text-sm py-2 min-w-[130px]"
        >
          <option value="">All Games</option>
          {games.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* Role filter */}
        <select
          value={activeRole || ''}
          onChange={(e) => updateFilter('role', e.target.value || null)}
          className="input-field text-sm py-2 min-w-[130px]"
        >
          <option value="">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* Clear & count */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 whitespace-nowrap">
            {totalCards} cards
          </span>
          {(activeRarity || activeGame || activeRole || query) && (
            <button
              onClick={clearAll}
              className="text-xs text-[#00e676] hover:text-[#00c853] transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
