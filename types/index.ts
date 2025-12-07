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
}

