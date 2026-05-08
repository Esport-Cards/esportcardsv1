'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
const RARITIES = ['Common', 'Rare', 'Epic', 'Legendary', 'Unique'];
const SEASONS = ['2024-S1', '2024-S2', '2025-S1'];

export default function AdminCardForm() {
  const router = useRouter();
  const [playerId, setPlayerId] = useState('');
  const [rarity, setRarity] = useState('Common');
  const [season, setSeason] = useState('2024-S1');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [players, setPlayers] = useState<any[]>([]);

  // Fetch players on mount
  useEffect(() => {
    fetch('/api/admin/players/list')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, rarity, season }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to create card');
      } else {
        setMessage('Card template created!');
        router.refresh();
      }
    } catch {
      setMessage('An error occurred');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Player</label>
          <select
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="input-field text-sm py-2"
            required
          >
            <option value="">Select player...</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.team})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Rarity</label>
          <select
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            className="input-field text-sm py-2"
          >
            {RARITIES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Season</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="input-field text-sm py-2"
          >
            {SEASONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <p className={`text-sm ${message.includes('created') ? 'text-[#00e676]' : 'text-red-400'}`}>{message}</p>
      )}
      <button type="submit" disabled={loading} className="btn-primary text-sm py-2 px-6 disabled:opacity-50">
        {loading ? 'Creating...' : 'Create Card Template'}
      </button>
    </form>
  );
}
