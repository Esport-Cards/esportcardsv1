'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navigation({
  session,
  isAdmin,
}: {
  session: any;
  isAdmin: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50 border-b border-[#0d4f3c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-[#00e676] text-xl font-bold neon-glow tracking-wider">
              E
            </span>
            <span className="font-display text-white text-xl font-bold tracking-wider hidden sm:inline">
              SPORT CARDS
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/marketplace" className="text-gray-300 hover:text-[#00e676] transition-colors">
              Marketplace
            </Link>
            <Link href="/players" className="text-gray-300 hover:text-[#00e676] transition-colors">
              Players
            </Link>
            <Link href="/leaderboard" className="text-gray-300 hover:text-[#00e676] transition-colors">
              Leaderboard
            </Link>
            {session && (
              <>
                <Link href="/packs" className="text-gray-300 hover:text-[#00e676] transition-colors">
                  Packs
                </Link>
                <Link href="/collection" className="text-gray-300 hover:text-[#00e676] transition-colors">
                  Collection
                </Link>
                <Link href="/team" className="text-gray-300 hover:text-[#00e676] transition-colors">
                  Team
                </Link>
              </>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-300 hover:text-[#00e676] text-sm transition-colors">
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="text-[#ffaa00] hover:text-yellow-400 text-sm transition-colors">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-[#00e676] text-sm transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-xs py-2 px-4">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="straight" strokeLinejoin="straight" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="straight" strokeLinejoin="straight" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-[#0d4f3c] px-4 py-4 space-y-3">
          <Link href="/marketplace" className="block text-gray-300 hover:text-[#00e676] py-1">Marketplace</Link>
          <Link href="/players" className="block text-gray-300 hover:text-[#00e676] py-1">Players</Link>
          <Link href="/leaderboard" className="block text-gray-300 hover:text-[#00e676] py-1">Leaderboard</Link>
          {session && (
            <>
              <Link href="/packs" className="block text-gray-300 hover:text-[#00e676] py-1">Packs</Link>
              <Link href="/collection" className="block text-gray-300 hover:text-[#00e676] py-1">Collection</Link>
              <Link href="/team" className="block text-gray-300 hover:text-[#00e676] py-1">Team</Link>
              <Link href="/dashboard" className="block text-gray-300 hover:text-[#00e676] py-1">Dashboard</Link>
              {isAdmin && (
                <Link href="/admin" className="block text-[#ffaa00] py-1">Admin</Link>
              )}
              <button onClick={() => signOut({ callbackUrl: '/' })} className="block text-gray-400 py-1 text-left">Logout</button>
            </>
          )}
          {!session && (
            <>
              <Link href="/login" className="block text-gray-300 py-1">Login</Link>
              <Link href="/register" className="block btn-primary text-center text-xs py-2">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
