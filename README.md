# Esport Cards — Digital Collectible Cards Platform

A full-stack esports digital collectible cards platform built with Next.js, Prisma, and NextAuth.

## Features

- **Authentication** — Sign up, login, protected routes
- **Card Collection** — Collect, filter, and browse player cards
- **Pack Opening** — Open digital packs with rarity-based randomization and animations
- **Team Builder** — Build 5-player lineups from your collection
- **Leaderboard** — Compete with other collectors
- **Marketplace** — Buy and sell cards with other users
- **Player Profiles** — Public pages for each pro player
- **Admin Panel** — Manage players, cards, packs, performances, and listings

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite via Prisma ORM
- **Auth:** NextAuth.js with credentials provider
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Generate Prisma client
```bash
npx prisma generate
```

### 3. Push schema to database
```bash
npx prisma db push
```

### 4. Seed the database
```bash
npm run seed
```
This creates:
- Admin account: `admin@esportcards.com` / `admin123`
- Demo user: `demo@esportcards.com` / `demo123`
- 20 real esports players (CS2, Valorant, LoL, Dota2)
- Card templates for each player across 5 rarities and 3 seasons
- 3 pack types (Starter, Pro, Elite)
- Sample marketplace listings

### 5. Run the development server
```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   ├── register/            # User registration
│   │   ├── packs/open/          # Pack opening logic
│   │   ├── team/save/           # Team lineup saving
│   │   ├── marketplace/
│   │   │   ├── buy/            # Card purchase
│   │   │   └── list/            # Create listing
│   │   └── admin/             # Admin API routes
│   ├── admin/                 # Admin pages
│   ├── (public pages)
│   │   ├── page.tsx           # Landing page
│   │   ├── about/page.tsx
│   │   ├── players/            # Players listing + profiles
│   │   ├── marketplace/
│   │   ├── login/
│   │   └── register/
│   └── (protected pages)
│       ├── dashboard/
│       ├── collection/
│       ├── packs/
│       ├── team/
│       └── profile/
├── components/
│   ├── ui/                    # Shared UI components
│   ├── cards/                 # Card-related components
│   ├── team/                  # Team builder components
│   ├── marketplace/           # Marketplace components
│   └── admin/                # Admin form components
└── lib/
    ├── prisma.ts              # Prisma client
    ├── auth.ts                 # NextAuth config
    └── utils.ts                # Utility functions
```

## Card Rarities

| Rarity | Chance | Bonus |
|--------|--------|-------|
| Common | 70% | 1 pt |
| Rare | 20% | 3 pts |
| Epic | 8% | 5 pts |
| Legendary | 2% | 10 pts |
| Unique | <1% | 20 pts |

## Admin Access

Login with `admin@esportcards.com` / `admin123` to access the admin panel at `/admin`.
"# esportcardsv1" 
