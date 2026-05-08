import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login?callbackUrl=/admin');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user?.isAdmin) redirect('/dashboard');

  const [playerCount, cardCount, packCount, listingCount, userCount] = await Promise.all([
    prisma.player.count(),
    prisma.cardTemplate.count(),
    prisma.pack.count(),
    prisma.marketplaceListing.count({ where: { isActive: true } }),
    prisma.user.count(),
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, createdAt: true, isAdmin: true },
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Admin <span className="text-[#00e676]">Panel</span>
          </h1>
          <p className="text-gray-400">Manage the Esport Cards platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Players', count: playerCount, href: '/admin/players', color: 'text-[#00e676]' },
            { label: 'Card Templates', count: cardCount, href: '/admin/cards', color: 'text-[#4a9eff]' },
            { label: 'Packs', count: packCount, href: '/admin/packs', color: 'text-[#b44aff]' },
            { label: 'Listings', count: listingCount, href: '/admin/listings', color: 'text-[#ffaa00]' },
            { label: 'Users', count: userCount, href: '#', color: 'text-white' },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href} className="panel p-4 card-hover">
              <div className={`text-2xl font-bold font-display ${stat.color}`}>{stat.count}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Manage Players', desc: 'Add, edit, or remove player profiles', href: '/admin/players', color: 'from-[#00e676]/10 to-transparent' },
            { title: 'Card Templates', desc: 'Create card templates with rarities', href: '/admin/cards', color: 'from-[#4a9eff]/10 to-transparent' },
            { title: 'Pack Management', desc: 'Configure pack types and pricing', href: '/admin/packs', color: 'from-[#b44aff]/10 to-transparent' },
          ].map((action) => (
            <Link key={action.title} href={action.href} className={`panel p-6 card-hover relative overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color}`} />
              <div className="relative">
                <h3 className="font-display text-lg font-bold text-white mb-2">{action.title}</h3>
                <p className="text-sm text-gray-400">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Users */}
        <div className="panel p-6">
          <h3 className="font-display text-lg font-bold text-white mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 bg-[#062a1f]/50 rounded-lg">
                <div>
                  <span className="text-white font-medium text-sm">{u.name}</span>
                  <span className="text-gray-500 text-xs ml-2">{u.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  {u.isAdmin && <span className="text-[#ffaa00] text-xs font-bold">ADMIN</span>}
                  <span className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
