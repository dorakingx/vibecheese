import { Market, User, CheeseRank } from '@/types'
import { calculateRank } from './services/gamificationService'

// Helper to generate random watchers count (50-500)
function randomWatchers(): number {
  return Math.floor(Math.random() * 450) + 50
}

export const mockMarkets: Market[] = [
  {
    id: '1',
    topic: 'Will this tweet hit 10k likes?',
    description: 'A viral tweet about Web3 trends is currently at 8.5k likes. Will it reach 10k by tomorrow?',
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    yesBets: 2500,
    noBets: 1800,
    totalVP: 4300,
    resolved: false,
    watchers: randomWatchers(),
  },
  {
    id: '2',
    topic: 'Will it rain in Tokyo tomorrow?',
    description: 'Weather forecast shows 60% chance of rain. What do you think?',
    deadline: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
    yesBets: 3200,
    noBets: 2100,
    totalVP: 5300,
    resolved: false,
    watchers: randomWatchers(),
  },
  {
    id: '3',
    topic: 'Will Bitcoin hit $100k this month?',
    description: 'BTC is currently at $95k. Will it break $100k before month end?',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    yesBets: 4500,
    noBets: 2800,
    totalVP: 7300,
    resolved: false,
    watchers: randomWatchers(),
  },
  {
    id: '4',
    topic: 'Will this new NFT collection sell out?',
    description: 'A highly anticipated collection drops in 6 hours. Will all 10k pieces sell?',
    deadline: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    yesBets: 1800,
    noBets: 3200,
    totalVP: 5000,
    resolved: false,
    watchers: randomWatchers(),
  },
  {
    id: '5',
    topic: 'Will the new iPhone get 5-star reviews?',
    description: 'Tech reviewers are testing the latest model. Will it score perfect ratings?',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    yesBets: 2200,
    noBets: 1900,
    totalVP: 4100,
    resolved: false,
    watchers: randomWatchers(),
  },
  {
    id: '6',
    topic: 'Will this YouTube video reach 1M views?',
    description: 'A creator\'s latest video is trending. Currently at 750k views.',
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    yesBets: 3100,
    noBets: 2400,
    totalVP: 5500,
    resolved: false,
    watchers: randomWatchers(),
  },
  {
    id: '7',
    topic: 'Will the stock market close green today?',
    description: 'Market opened mixed. Will it finish in positive territory?',
    deadline: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    yesBets: 2700,
    noBets: 2300,
    totalVP: 5000,
    resolved: false,
    watchers: randomWatchers(),
  },
  {
    id: '8',
    topic: 'Will this new restaurant get Michelin stars?',
    description: 'A trendy new spot opened last month. Will critics award stars?',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    yesBets: 1500,
    noBets: 3500,
    totalVP: 5000,
    resolved: false,
    watchers: randomWatchers(),
  },
  {
    id: '9',
    topic: 'Will this meme coin pump 10x?',
    description: 'A new token is gaining traction. Will it 10x in the next week?',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    yesBets: 4200,
    noBets: 3800,
    totalVP: 8000,
    resolved: false,
    watchers: randomWatchers(),
  },
  {
    id: '10',
    topic: 'Will this app hit #1 in App Store?',
    description: 'A new social app is climbing the charts. Currently at #5.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    yesBets: 2900,
    noBets: 2100,
    totalVP: 5000,
    resolved: false,
    watchers: randomWatchers(),
  },
  {
    id: '11',
    topic: 'Will it snow in New York this weekend?',
    description: 'Forecast shows potential winter weather. Will the city see snow?',
    deadline: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
    yesBets: 2400,
    noBets: 2600,
    totalVP: 5000,
    resolved: false,
    watchers: randomWatchers(),
  },
  {
    id: '12',
    topic: 'Will this movie break box office records?',
    description: 'A highly anticipated film releases Friday. Will it set records?',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    yesBets: 3600,
    noBets: 3400,
    totalVP: 7000,
    resolved: false,
    watchers: randomWatchers(),
  },
]

export const mockLeaderboardUsers: User[] = [
  { id: '1', name: 'CryptoWhale', vpBalance: 15200, totalWins: 45, totalBets: 78, rank: calculateRank(15200, 45) },
  { id: '2', name: 'VibeMaster', vpBalance: 12800, totalWins: 38, totalBets: 65, rank: calculateRank(12800, 38) },
  { id: '3', name: 'PredictionPro', vpBalance: 11500, totalWins: 42, totalBets: 72, rank: calculateRank(11500, 42) },
  { id: '4', name: 'TrendSetter', vpBalance: 9800, totalWins: 35, totalBets: 58, rank: calculateRank(9800, 35) },
  { id: '5', name: 'FutureSeer', vpBalance: 9200, totalWins: 33, totalBets: 55, rank: calculateRank(9200, 33) },
  { id: '6', name: 'MarketGuru', vpBalance: 8700, totalWins: 31, totalBets: 52, rank: calculateRank(8700, 31) },
  { id: '7', name: 'VibeCheeser', vpBalance: 8100, totalWins: 29, totalBets: 48, rank: calculateRank(8100, 29) },
  { id: '8', name: 'Oracle', vpBalance: 7600, totalWins: 27, totalBets: 45, rank: calculateRank(7600, 27) },
  { id: '9', name: 'ForecastKing', vpBalance: 7200, totalWins: 26, totalBets: 43, rank: calculateRank(7200, 26) },
  { id: '10', name: 'TrendWatcher', vpBalance: 6800, totalWins: 24, totalBets: 40, rank: calculateRank(6800, 24) },
]

