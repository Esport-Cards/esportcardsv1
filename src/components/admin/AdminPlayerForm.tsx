'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GAMES = ['CS2', 'Valorant', 'LoL', 'Dota2'];
const ROLES = ['Captain', 'Flex', 'Entry', 'Support', 'AWP'];

export default function AdminPlayerForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', slug: '', team: '', teamCode: '', role: 'Entry', game: 'CS2', country: '', description: '', image: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const slug = form.slug || generateSlug(form.name);
    try {
      const res = await fetch('/api/admin/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to create player');
      } else {
        setMessage('Player created!');
        setForm({ name: '', slug: '', team: '', teamCode: '', role: 'Entry', game: 'CS2', country: '', description: '', image: '' });
        router.refresh();
      }
    } catch {
      setMessage('An error occurred');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || generateSlug(e.target.value) })}
            className="input-field text-sm py-2" placeholder="e.g. s1mple" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Slug</label>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="input-field text-sm py-2" placeholder="auto-generated" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Team</label>
          <input required value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })}
            className="input-field text-sm py-2" placeholder="e.g. NAVI" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Team Code</label>
          <input required value={form.teamCode} onChange={(e) => setForm({ ...form, teamCode: e.target.value })}
            className="input-field text-sm py-2" placeholder="e.g. NAVI" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field text-sm py-2">
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Game</label>
          <select value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} className="input-field text-sm py-2">
            {GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Country Code</label>
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="input-field text-sm py-2" placeholder="e.g. ua" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Image URL</label>
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="input-field text-sm py-2" placeholder="https://..." />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-field text-sm py-2 min-h-[60px] resize-y" placeholder="Player description..." />
      </div>

      {message && (
        <p className={`text-sm ${message.includes('created') ? 'text-[#00e676]' : 'text-red-400'}`}>{message}</p>
      )}
      <button type="submit" disabled={loading} className="btn-primary text-sm py-2 px-6 disabled:opacity-50">
        {loading ? 'Creating...' : 'Create Player'}
      </button>
    </form>
  );
}
