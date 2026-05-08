import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AdminPackForm from '@/components/admin/AdminPackForm';

export default async function AdminPacksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login?callbackUrl=/admin/packs');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.isAdmin) redirect('/dashboard');

  const packs = await prisma.pack.findMany({ orderBy: { price: 'asc' } });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Manage <span className="text-[#00e676]">Packs</span>
            </h1>
            <p className="text-gray-400">Configure pack types and pricing</p>
          </div>
          <a href="/admin" className="text-sm text-[#00e676] hover:text-[#00c853]">← Back to Admin</a>
        </div>

        <div className="panel p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-white mb-4">Add New Pack</h2>
          <AdminPackForm />
        </div>

        <div className="panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0d4f3c]">
                <th className="text-left text-xs text-gray-400 p-3">Name</th>
                <th className="text-left text-xs text-gray-400 p-3">Cards</th>
                <th className="text-right text-xs text-gray-400 p-3">Price</th>
                <th className="text-center text-xs text-gray-400 p-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {packs.map((pack) => (
                <tr key={pack.id} className="border-b border-[#0d4f3c]/50">
                  <td className="p-3 text-white text-sm font-medium">{pack.name}</td>
                  <td className="p-3 text-gray-400 text-sm">{pack.cardCount}</td>
                  <td className="p-3 text-right text-[#00e676] font-mono text-sm">${(pack.price / 100).toFixed(2)}</td>
                  <td className="p-3 text-center">
                    {pack.isActive ? (
                      <span className="text-[#00e676] text-xs">✓</span>
                    ) : (
                      <span className="text-gray-500 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
