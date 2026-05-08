import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminListingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login?callbackUrl=/admin/listings');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.isAdmin) redirect('/dashboard');

  const listings = await prisma.marketplaceListing.findMany({
    orderBy: { listedAt: 'desc' },
    include: {
      ownedCard: { include: { cardTemplate: { include: { player: true } } },
      seller: { select: { id: true, name: true } },
      buyer: { select: { id: true, name: true } },
    },
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Manage <span className="text-[#00e676]">Listings</span>
            </h1>
            <p className="text-gray-400">View and manage marketplace listings</p>
          </div>
          <a href="/admin" className="text-sm text-[#00e676] hover:text-[#00c853]">← Back to Admin</a>
        </div>

        <div className="panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0d4f3c]">
                <th className="text-left text-xs text-gray-400 p-3">Card</th>
                <th className="text-left text-xs text-gray-400 p-3">Seller</th>
                <th className="text-left text-xs text-gray-400 p-3">Buyer</th>
                <th className="text-right text-xs text-gray-400 p-3">Price</th>
                <th className="text-center text-xs text-gray-400 p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className="border-b border-[#0d4f3c]/50">
                  <td className="p-3">
                    <div className="text-white text-sm font-medium">{listing.ownedCard.cardTemplate.player.name}</div>
                    <div className="text-xs text-gray-500">{listing.ownedCard.rarity}</div>
                  </td>
                  <td className="p-3 text-gray-300 text-sm">{listing.seller.name}</td>
                  <td className="p-3 text-gray-300 text-sm">{listing.buyer?.name || '—'}</td>
                  <td className="p-3 text-right text-[#00e676] font-mono text-sm">
                    ${(listing.price / 100).toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    {listing.buyerId ? (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Sold</span>
                    ) : (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {listings.length === 0 && (
            <div className="text-center py-8 text-gray-500">No listings yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
