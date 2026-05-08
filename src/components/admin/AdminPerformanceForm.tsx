'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPerformanceForm() {
  const router = useRouter();
  const [playerId, setPlayerId] = useState('');
  const [userId, setUserId] = useState('');
  const [players, setPlayers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/players/list')
      .then(r => r.json())
      .then(d => setPlayers(d))
      .catch(() => {});
    fetch('/api/admin/users/list')
      .then(r => r.json())
      .then(d => setUsers(d))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const form = new FormData(e.target as HTMLFormElement);
    const res = await fetch('/api/admin/performances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId,
        userId,
        kills: parseInt(form.get('kills') as string),
        deaths: parseInt(form.get('deaths') as string),
        assists: parseInt(form.get('assists') as string),
        headshots: parseInt(form.get('headshots') as string),
        rating: parseFloat(form.get('rating') as string),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Failed');
    } else {
      setMessage('Performance added!');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Player</label>
          <select value={playerId} onChange={e => setPlayerId(e.target.value)} className="input-field text-sm py-2" required>
            <option value="">Select player...</option>
            {players.map(p => <option key={p.id} value={p.id}>{p.name} ({p.team})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">User</label>
          <select value={userId} onChange={e => setUserId(e.target.value)} className="input-field text-sm py-2" required>
            <option value="">Select user...</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        {['kills', 'deaths', 'assists', 'headshots'].map(f => (
          <div key={f}>
            <label className="block text-xs text-gray-400 mb-1 capitalize">{f}</label>
            <input name={f} type="number" defaultValue="0" className="input-field text-sm py-2" required />
          </div>
        ))}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Rating</label>
          <input name="rating" type="number" step="0.01" defaultValue="1.00" className="input-field text-sm py-2" required />
        </div>
      </div>
      {message && <p className={`text-sm ${message.includes('added') ? 'text-[#00e676]' : 'text-red-400'}`}>{message}</p>}
      <button type="submit" disabled={loading} className="btn-primary text-sm py-2 px-6 disabled:opacity-50">
        {loading ? 'Adding...' : 'Add Performance'}
      </button>
    </form>
  );
}
