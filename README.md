# VibeCheese: A Gamified Prediction Market on Soneium

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
- **Web3**: viem for blockchain interactions
- **Deployment**: Vercel-ready

## Architecture & Web3 Features

- **Soneium Minato Ready**: Configured for Chain ID 1946 with viem integration
- **Simulated Account Abstraction**: Uses local "Burner Wallets" to demonstrate gasless, one-click onboarding (Startale AA pattern)
- **Cryptographic Verification**: All bets are signed by the user's local key pair to ensure authenticity

## Technical Architecture

### Account Abstraction (AA) Simulation

For this MVP, we use local **Burner Wallets** (viem) to simulate the Gasless/AA experience required by Startale. The UX is identical to the final production version.

#### Key Components

1. **Burner Wallet Generation**
   - Uses `viem`'s `generatePrivateKey()` and `privateKeyToAccount()` to create real cryptographic accounts
   - Private keys stored in localStorage for MVP (production would use secure key management)
   - Each user gets a unique Ethereum-compatible address

2. **Message Signing**
   - All bet transactions are cryptographically signed using the burner wallet
   - Signatures are logged to console for verification
   - Message format: `"VibeCheese Bet: [marketId] - [side] - [amount] VP"`

3. **Soneium Minato Testnet Connectivity**
   - Public client connection to Soneium Minato Testnet (Chain ID: 1946)
   - Real-time block number fetching
   - Network status displayed in UI footer

4. **Future Integration Path**
   - Current implementation prepares for Startale AA SDK integration
   - Service-oriented architecture allows easy swap of mock service with production SDK
   - All blockchain operations go through `IBlockchainService` interface

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

