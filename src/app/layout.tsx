import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import LogoutButton from '@/components/layout/LogoutButton';
import Navigation from '@/components/layout/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Esport Cards | Digital Collectible Cards',
  description: 'Collect, trade, and build teams with official esports player cards.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  let isAdmin = false;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true },
    });
    isAdmin = user?.isAdmin || false;
  }

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#040f0a] text-gray-200 antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Navigation session={session} isAdmin={isAdmin} />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[#0d4f3c] bg-[#062a1f]/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="font-display text-[#00e676] text-lg font-bold neon-glow">ESPORT CARDS</div>
                  <p className="text-sm text-gray-400 mt-2">The premier digital collectible cards platform for esports fans.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Platform</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link href="/marketplace" className="hover:text-[#00e676] transition-colors">Marketplace</Link></li>
                    <li><Link href="/packs" className="hover:text-[#00e676] transition-colors">Open Packs</Link></li>
                    <li><Link href="/collection" className="hover:text-[#00e676] transition-colors">My Collection</Link></li>
                    <li><Link href="/team" className="hover:text-[#00e676] transition-colors">Team Builder</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Info</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link href="/about" className="hover:text-[#00e676] transition-colors">About</Link></li>
                    <li><Link href="/players" className="hover:text-[#00e676] transition-colors">Players</Link></li>
                    <li><Link href="/leaderboard" className="hover:text-[#00e676] transition-colors">Leaderboard</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Account</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {session ? (
                      <>
                        <li><Link href="/dashboard" className="hover:text-[#00e676] transition-colors">Dashboard</Link></li>
                        <li><Link href="/profile" className="hover:text-[#00e676] transition-colors">Profile</Link></li>
                        {isAdmin && (
                          <li><Link href="/admin" className="hover:text-[#00e676] transition-colors">Admin Panel</Link></li>
                        )}
                      </>
                    ) : (
                      <>
                        <li><Link href="/login" className="hover:text-[#00e676] transition-colors">Login</Link></li>
                        <li><Link href="/register" className="hover:text-[#00e676] transition-colors">Register</Link></li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              <div className="border-t border-[#0d4f3c] mt-8 pt-6 text-center text-sm text-gray-500">
                &copy; 2024 Esport Cards. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
