export interface Market {
  id: string;
  topic: string;
  description: string;
  imageUrl?: string;
  deadline: Date;
  yesBets: number;
  noBets: number;
  totalVP: number;
  resolved?: boolean;
  outcome?: 'yes' | 'no';
  watchers?: number; // number of people watching
}

export interface Bet {
  id: string;
  marketId: string;
  side: 'yes' | 'no';
  amount: number;
  timestamp: Date;
  resolved?: boolean;
  won?: boolean;
}

export interface User {
  id: string;
  name: string;
  vpBalance: number;
  totalWins: number;
  totalBets: number;
  rank?: CheeseRank;
}

export interface DailyStreak {
  currentStreak: number;
  lastBetDate: string; // ISO date string
  longestStreak: number;
}

export type CheeseRank = 'Baby Cheese' | 'Cheddar Knight' | 'Gorgonzola King';

export interface Transaction {
  id: string;
  type: 'mint' | 'bet' | 'reward';
  amount: number;
  timestamp: Date;
  hash?: string; // blockchain transaction hash
}

