'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPackForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', cardCount: '5',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/packs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price) * 100,
          cardCount: parseInt(form.cardCount),
          slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to create pack');
      } else {
        setMessage('Pack created!');
        setForm({ name: '', slug: '', description: '', price: '', cardCount: '5' });
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
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field text-sm py-2" placeholder="e.g. Elite Pack" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Slug</label>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="input-field text-sm py-2" placeholder="auto-generated" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Price ($)</label>
          <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="input-field text-sm py-2" placeholder="29.99" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Card Count</label>
          <input required type="number" value={form.cardCount} onChange={(e) => setForm({ ...form, cardCount: e.target.value })}
            className="input-field text-sm py-2" placeholder="5" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Description</label>
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-field text-sm py-2" placeholder="Pack description" />
      </div>

      {message && (
        <p className={`text-sm ${message.includes('created') ? 'text-[#00e676]' : 'text-red-400'}`}>{message}</p>
      )}
      <button type="submit" disabled={loading} className="btn-primary text-sm py-2 px-6 disabled:opacity-50">
        {loading ? 'Creating...' : 'Create Pack'}
      </button>
    </form>
  );
}
