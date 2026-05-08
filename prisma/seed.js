const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@esportcards.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@esportcards.com',
      password: adminPassword,
      isAdmin: true,
      stats: { create: { totalCards: 0, packsOpened: 0, currentRank: 0, totalScore: 0 } },
    },
  });

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@esportcards.com' },
    update: {},
    create: {
      name: 'DemoUser',
      email: 'demo@esportcards.com',
      password: demoPassword,
      isAdmin: false,
      stats: { create: { totalCards: 0, packsOpened: 0, currentRank: 0, totalScore: 0 } },
    },
  });

  console.log('Created users');

  // Real esports players
  const players = [
    // CS2 Players
    { name: 's1mple', slug: 's1mple', team: 'NAVI', teamCode: 'NV', role: 'AWP', game: 'CS2', country: 'ua', description: 'Oleksandr Kostyliev, widely regarded as the greatest CS player of all time.' },
    { name: 'ZywOo', slug: 'zywoo', team: 'Vitality', teamCode: 'VIT', role: 'AWP', game: 'CS2', country: 'fr', description: 'Mathieu Herbaut, two-time HLTV Top 1 player and AWP specialist.' },
    { name: 'm0NESY', slug: 'm0nesy', team: 'G2', teamCode: 'G2', role: 'AWP', game: 'CS2', country: 'ru', description: 'Danil Golubenko, prodigy AWPer and rifler for G2 Esports.' },
    { name: 'sh1ro', slug: 'sh1ro', team: 'Spirit', teamCode: 'SPI', role: 'Entry', game: 'CS2', country: 'ru', description: 'Dmitry Sokolov, consistent entry fragger and team leader.' },
    { name: 'NiKo', slug: 'niko', team: 'FURIA', teamCode: 'FUR', role: 'Flex', game: 'CS2', country: 'ba', description: 'Nikola Kovač, one of the most mechanically gifted players in CS history.' },
    { name: 'device', slug: 'device', team: 'Astralis', teamCode: 'AST', role: 'AWP', game: 'CS2', country: 'dk', description: 'Nicolai Reedtz, former Astralis star and Major winner.' },
    { name: 'ropz', slug: 'ropz', team: 'Vitality', teamCode: 'VIT', role: 'Support', game: 'CS2', country: 'ee', description: 'Robin Kool, one of the best support players in CS2.' },
    { name: 'Twistzz', slug: 'twistzz', team: 'FaZe', teamCode: 'FAZ', role: 'Entry', game: 'CS2', country: 'ca', description: 'Russel Van Dulken, explosive entry fragger for FaZe Clan.' },
    { name: 'apEX', slug: 'apex', team: 'Vitality', teamCode: 'VIT', role: 'Captain', game: 'CS2', country: 'fr', description: 'Dan Madesclaire, veteran IGL and captain of Team Vitality.' },

    // Valorant Players
    { name: 'TenZ', slug: 'tenz', team: 'Sentinels', teamCode: 'SEN', role: 'Entry', game: 'Valorant', country: 'ca', description: 'Tyson Ngo, one of the most popular Valorant players worldwide.' },
    { name: 'aspas', slug: 'aspas', team: 'LOUD', teamCode: 'LOU', role: 'Entry', game: 'Valorant', country: 'br', description: 'Erick Santos, VCT Champion and one of the best duelists in Valorant.' },
    { name: 'Boaster', slug: 'boaster', team: 'FNATIC', teamCode: 'FNC', role: 'Captain', game: 'Valorant', country: 'gb', description: 'Jake Howlett, IGL of FNATIC and VCT Champion.' },
    { name: 'Leo', slug: 'leo', team: 'FNATIC', teamCode: 'FNC', role: 'Support', game: 'Valorant', country: 'es', description: 'Ilya Osipov, superstar initiator and VCT Champion with FNATIC.' },
    { name: 'f0rsakeN', slug: 'f0rsaken', team: 'Paper Rex', teamCode: 'PRX', role: 'Flex', game: 'Valorant', country: 'id', description: 'Jason Susanto, mechanical prodigy from Indonesia.' },
    { name: 'nAts', slug: 'nats', team: 'Team Liquid', teamCode: 'TL', role: 'Sentinel', game: 'Valorant', country: 'ru', description: 'Aleksandr Markov, regarded as one of the best sentinels in the world.' },
    { name: 'Chronicle', slug: 'chronicle', team: 'Sentinels', teamCode: 'SEN', role: 'Flex', game: 'Valorant', country: 'ru', description: 'Timofey Khromov, two-time VCT Champion with Gambit/LOUD.' },

    // League of Legends
    { name: 'Faker', slug: 'faker', team: 'T1', teamCode: 'T1', role: 'Captain', game: 'LoL', country: 'kr', description: 'Lee Sang-hyeok, the Unkillable Demon King and 5-time World Champion.' },
    { name: 'Caps', slug: 'caps', team: 'G2', teamCode: 'G2', role: 'Mid', game: 'LoL', country: 'dk', description: 'Rasmus Winther, veteran mid-laner and multiple LEC champion.' },
    { name: 'Zeka', slug: 'zeka', team: 'Hanwha Life', teamCode: 'HLE', role: 'Mid', game: 'LoL', country: 'kr', description: 'Kim Geon-woo, explosive mid-laner for Hanwha Life Esports.' },
    { name: 'TheShy', slug: 'theshy', team: 'Weibo Gaming', teamCode: 'WBG', role: 'Top', game: 'LoL', country: 'cn', description: 'Kang Seung-lok, legendary top-laner and World Champion.' },

    // Dota 2
    { name: 'Nisha', slug: 'nisha', team: 'Team Liquid', teamCode: 'TL', role: 'Mid', game: 'Dota2', country: 'pl', description: 'Michał Jankowski, one of the most skilled mid-laners in Dota 2.' },
    { name: 'Puppey', slug: 'puppey', team: 'Team Secret', teamCode: 'SEC', role: 'Captain', game: 'Dota2', country: 'lt', description: 'Clement Ivanov, legendary Dota 2 captain and 1-time TI winner.' },
    { name: 'Topson', slug: 'topson', team: 'Tundra', teamCode: 'TUN', role: 'Offlane', game: 'Dota2', country: 'no', description: 'Topias Taavitsainen, two-time TI winner with OG.' },
    { name: 'Yatoro', slug: 'yatoro', team: 'Team Spirit', teamCode: 'SPI', role: 'Carry', game: 'Dota2', country: 'ru', description: 'Ilya Mulyarchuk, TI winner and one of the best carries in Dota 2.' },
  ];

  for (const player of players) {
    await prisma.player.upsert({
      where: { slug: player.slug },
      update: player,
      create: player,
    });
  }
  console.log(`Created ${players.length} players`);

  // Create card templates for each player (one per rarity)
  const rarities = ['Common', 'Rare', 'Epic', 'Legendary', 'Unique'];
  const seasons = ['2024-S1', '2024-S2', '2025-S1'];

  const allPlayers = await prisma.player.findMany();
  for (const player of allPlayers) {
    for (const rarity of rarities) {
      for (const season of seasons) {
        await prisma.cardTemplate.upsert({
          where: {
            id: `${player.id}-${rarity}-${season}`,
          },
          update: {},
          create: {
            playerId: player.id,
            rarity,
            season,
            design: 'default',
          },
        });
      }
    }
  }
  console.log('Created card templates');

  // Create pack types
  await prisma.pack.upsert({
    where: { slug: 'starter-pack' },
    update: {},
    create: {
      name: 'Starter Pack',
      slug: 'starter-pack',
      description: 'Perfect for new collectors. Contains 5 cards with guaranteed Rare or better.',
      price: 499,
      cardCount: 5,
      isActive: true,
    },
  });

  await prisma.pack.upsert({
    where: { slug: 'pro-pack' },
    update: {},
    create: {
      name: 'Pro Pack',
      slug: 'pro-pack',
      description: 'Pro-level pack with 7 cards. Higher chance of Epic and Legendary cards.',
      price: 1299,
      cardCount: 7,
      isActive: true,
    },
  });

  await prisma.pack.upsert({
    where: { slug: 'elite-pack' },
    update: {},
    create: {
      name: 'Elite Pack',
      slug: 'elite-pack',
      description: 'Ultimate collector pack. 10 cards with guaranteed Legendary and Unique pulls.',
      price: 2999,
      cardCount: 10,
      isActive: true,
    },
  });
  console.log('Created packs');

  // Create some sample marketplace listings
  const demoCards = await prisma.ownedCard.findMany({
    take: 3,
    include: { cardTemplate: true },
  });

  for (const card of demoCards) {
    await prisma.marketplaceListing.upsert({
      where: { id: `listing-${card.id}` },
      update: {},
      create: {
        ownedCardId: card.id,
        sellerId: demoUser.id,
        price: card.cardTemplate.rarity === 'Legendary' ? 5000 : card.cardTemplate.rarity === 'Epic' ? 2500 : 1000,
        isActive: true,
      },
    });
  }
  console.log('Created sample marketplace listings');

  console.log('Seed completed!');
  console.log('Admin login: admin@esportcards.com / admin123');
  console.log('Demo login: demo@esportcards.com / demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
