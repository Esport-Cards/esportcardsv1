import Link from 'next/link';

// Real featured players with actual data
const featuredPlayers = [
  { name: 's1mple', team: 'NAVI', role: 'AWP', game: 'CS2', country: '🇺🇦', rating: '1.30' },
  { name: 'ZywOo', team: 'Vitality', role: 'AWP', game: 'CS2', country: '🇫🇷', rating: '1.28' },
  { name: 'sh1ro', team: 'Spirit', role: 'Entry', game: 'CS2', country: '🇷🇺', rating: '1.18' },
  { name: 'm0NESY', team: 'G2', role: 'AWP', game: 'CS2', country: '🇷🇺', rating: '1.22' },
  { name: 'TenZ', team: 'Sentinels', role: 'Entry', game: 'Valorant', country: '🇨🇦', rating: '1.15' },
  { name: 'aspas', team: 'LOUD', role: 'Entry', game: 'Valorant', country: '🇧🇷', rating: '1.25' },
];

const howItWorks = [
  { step: '01', title: 'Create Account', desc: 'Sign up in seconds and join the premier esports card collecting community.' },
  { step: '02', title: 'Open Packs', desc: 'Purchase digital card packs featuring top pros from CS2, Valorant, LoL, and Dota2.' },
  { step: '03', title: 'Build Collection', desc: 'Collect cards across rarities — Common, Rare, Epic, Legendary, and Unique.' },
  { step: '04', title: 'Trade & Compete', desc: 'Build your dream team lineup, climb the leaderboard, and trade on the marketplace.' },
];

const packTypes = [
  { name: 'Starter Pack', price: 499, cards: 5, desc: 'Perfect for new collectors. Contains 5 cards with guaranteed Rare or better.', color: 'from-gray-400 to-gray-600' },
  { name: 'Pro Pack', price: 1299, cards: 7, desc: 'Pro-level pack with 7 cards. Higher chance of Epic and Legendary cards.', color: 'from-blue-400 to-blue-600' },
  { name: 'Elite Pack', price: 2999, cards: 10, desc: 'Ultimate collector pack. 10 cards with guaranteed Legendary and Unique pulls.', color: 'from-purple-400 to-purple-600' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#040f0a] via-[#0a3d2f] to-[#062a1f]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,230,118,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,230,118,0.05),transparent_50%)]" />

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-6 inline-block animate-float">
            <span className="font-display text-[#00e676] text-lg tracking-[0.3em] uppercase">Digital Collectibles</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
            <span className="neon-glow">ESPORT</span>
            <br />
            <span className="bg-gradient-to-r from-[#00e676] to-[#00c853] bg-clip-text text-transparent">
              CARDS
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Collect, trade, and build teams with officially licensed digital cards
            featuring the world's top esports professionals. Open packs, complete
            your collection, and dominate the leaderboards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Start Collecting
            </Link>
            <Link href="/marketplace" className="btn-secondary text-lg px-8 py-4">
              Explore Market
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00e676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>500+ Pro Players</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00e676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>4 Major Games</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00e676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>5 Card Rarities</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[#00e676]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Players */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Featured <span className="text-[#00e676]">Players</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Collect cards from the biggest names in competitive gaming across CS2, Valorant, League of Legends, and Dota 2.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlayers.map((player) => (
              <div key={player.name} className="panel p-6 card-hover group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00e676]/20 to-[#0a3d2f] flex items-center justify-center text-xl">
                      {player.country}
                    </div>
                    <div>
                      <h3 className="text-white font-bold font-display">{player.name}</h3>
                      <p className="text-sm text-gray-400">{player.team} • {player.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-[#00e676]/10 text-[#00e676] px-2 py-1 rounded">
                    {player.game}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#0d4f3c]">
                  <span className="text-sm text-gray-400">Rating</span>
                  <span className="text-[#00e676] font-mono font-bold">{player.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 relative bg-[#062a1f]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              How It <span className="text-[#00e676]">Works</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get started in four simple steps and join thousands of collectors worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <div key={item.step} className="panel p-6 text-center card-hover relative">
                <div className="w-12 h-12 rounded-full bg-[#00e676]/10 border border-[#00e676]/30 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-[#00e676] font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-[#00e676]/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pack Types Teaser */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Card <span className="text-[#00e676]">Packs</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose your pack and discover exclusive cards. Each pack contains random cards based on rarity distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {packTypes.map((pack) => (
              <div key={pack.name} className="panel p-8 text-center card-hover border-[#00e676]/10 hover:border-[#00e676]/30 transition-all">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${pack.color} flex items-center justify-center`}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-white font-display font-bold text-lg mb-2">{pack.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{pack.desc}</p>
                <div className="text-2xl font-bold text-[#00e676] mb-2">{pack.cards} Cards</div>
                <div className="text-xl font-display font-bold text-white">
                  ${pack.price / 100}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/packs" className="btn-primary text-lg px-8 py-3">
              View All Packs
            </Link>
          </div>
        </div>
      </section>

      {/* Marketplace Teaser */}
      <section className="py-20 px-4 relative bg-[#062a1f]/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="text-[#00e676]">Marketplace</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Buy and sell cards with other collectors. Find rare cards, complete your sets,
            and discover exclusive deals from the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace" className="btn-primary text-lg px-8 py-3">
              Browse Marketplace
            </Link>
            <Link href="/register" className="btn-secondary text-lg px-8 py-3">
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="panel p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00e676]/5 to-transparent" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 relative">
              Ready to Build Your <span className="text-[#00e676]">Collection</span>?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto relative">
              Join thousands of esports fans collecting digital cards. Open your first pack today
              and discover legendary players.
            </p>
            <Link href="/register" className="btn-primary text-lg px-10 py-4 relative">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
