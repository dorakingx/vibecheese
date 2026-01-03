# VibeCheese - Social Vibe Forecasting Mini App

A mobile-first Prediction Market Mini App for the Soneium ecosystem where users predict future trends using free "Vibe Points (VP)" instead of real cryptocurrency.

## Features

- 🎯 **Prediction Markets**: Bet on various trends and events
- 💎 **Vibe Points System**: Earn and bet with VP (no real money)
- 📊 **Live Odds**: Real-time odds based on community betting
- 🏆 **Leaderboard**: Compete with other users
- 📱 **Mobile-First**: Optimized for mobile devices with native app feel
- 🌙 **Dark Theme**: Futuristic design with neon blue/purple accents

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **State Management**: Zustand with localStorage persistence
- **Deployment**: Vercel-ready

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
VibeCheese/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home feed
│   ├── leaderboard/       # Leaderboard page
│   └── profile/           # Profile page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── MarketCard.tsx    # Market card component
│   ├── BettingModal.tsx  # Betting interface
│   ├── BottomNav.tsx     # Bottom navigation
│   └── LeaderboardRow.tsx # Leaderboard row
├── lib/                   # Utilities and stores
│   ├── store.ts          # Zustand store
│   ├── mock-data.ts      # Mock data
│   └── utils.ts          # Utility functions
└── types/                 # TypeScript types
```

## How It Works

1. **Initial VP Balance**: New users start with 1000 VP
2. **Betting**: Users can bet "Vibe In" (Yes) or "Vibe Out" (No) on prediction markets
3. **Odds**: Calculated based on current bet distribution
4. **Payouts**: Winners split the losing pool proportionally
5. **Persistence**: All data stored in localStorage for MVP

## Compliance

This app complies with Japanese regulations by:
- Using free "Vibe Points" instead of real cryptocurrency
- No real money is lost or gained
- VP can only be earned through login rewards or winning predictions

## License

MIT

