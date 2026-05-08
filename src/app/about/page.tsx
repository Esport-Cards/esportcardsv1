import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="text-[#00e676] neon-glow">Esport Cards</span>
          </h1>
          <p className="text-gray-400 text-lg">The premier digital collectible card platform for esports</p>
        </div>

        {/* Mission */}
        <div className="panel p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Esport Cards brings the excitement of physical trading cards to the digital age.
            Collect officially licensed cards featuring the world's top esports professionals
            from games like CS2, Valorant, League of Legends, and Dota 2.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Build your dream team, compete on leaderboards, and trade with collectors worldwide.
            Each card is uniquely minted with a serial number, making your collection truly one-of-a-kind.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { title: 'Collect', desc: '500+ player cards across multiple rarities — Common, Rare, Epic, Legendary, and Unique.', icon: '🃏' },
            { title: 'Trade', desc: 'Buy and sell cards on our marketplace. Set your prices and grow your collection.', icon: '💱' },
            { title: 'Compete', desc: 'Build 5-player lineups and climb the weekly leaderboards.', icon: '🏆' },
            { title: 'Discover', desc: 'Open packs with different rarity distributions. Hunt for that legendary pull!', icon: '🎁' },
          ].map((f) => (
            <div key={f.title} className="panel p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-display text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="panel p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="space-y-6">
            {[
              { step: '01', title: 'Create Your Account', desc: 'Sign up in seconds and get instant access to the marketplace.' },
              { step: '02', title: 'Open Card Packs', desc: 'Choose from Starter, Pro, or Elite packs. Each pack contains random cards based on rarity distribution.' },
              { step: '03', title: 'Build Your Collection', desc: 'Every card has a unique serial number. Collect them all across different seasons and games.' },
              { step: '04', title: 'Build Your Team', desc: 'Create a 5-player lineup from your collection. Earn points based on card rarities.' },
              { step: '05', title: 'Climb the Leaderboard', desc: 'Compete with other collectors. Weekly rankings reset with new opportunities to reach #1.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#00e676]/10 border border-[#00e676]/30 flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-[#00e676] font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rarity Guide */}
        <div className="panel p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-white mb-6">Card Rarities</h2>
          <div className="space-y-4">
            {[
              { name: 'Common', chance: '70%', color: 'border-l-gray-400', desc: 'Base cards for every player. Great for building your core collection.' },
              { name: 'Rare', chance: '20%', color: 'border-l-blue-400', desc: 'Enhanced cards with improved artwork and stats.' },
              { name: 'Epic', chance: '8%', color: 'border-l-purple-400', desc: 'Premium cards featuring unique designs and effects.' },
              { name: 'Legendary', chance: '2%', color: 'border-l-amber-400', desc: 'Ultra-rare cards of the top performers. Highly sought after.' },
              { name: 'Unique', chance: '<1%', color: 'border-l-red-400', desc: 'One-of-a-kind cards. The ultimate prize for any collector.' },
            ].map((r) => (
              <div key={r.name} className={`panel p-4 border-l-4 ${r.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold">{r.name}</h4>
                    <p className="text-sm text-gray-400">{r.desc}</p>
                  </div>
                  <span className="font-mono text-sm text-gray-300">{r.chance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center panel p-10">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to Start Collecting?
          </h2>
          <p className="text-gray-400 mb-6">Join thousands of collectors today.</p>
          <Link href="/register" className="btn-primary text-lg px-10 py-3">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
