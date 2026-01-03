import { DailyStreak, CheeseRank } from '@/types'

/**
 * Gamification Service
 * Handles streak tracking, rank calculations, and bonus logic
 */

/**
 * Checks if a day has been missed (immediate reset, no grace period)
 * @param lastDate ISO date string of last bet
 * @returns true if day was missed
 */
export function hasMissedDay(lastDate: string): boolean {
  const lastBetDate = new Date(lastDate)
  const today = new Date()
  
  // Reset time to midnight for accurate day comparison
  const lastBetDay = new Date(lastBetDate.getFullYear(), lastBetDate.getMonth(), lastBetDate.getDate())
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  
  // Calculate difference in days
  const diffTime = todayDay.getTime() - lastBetDay.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  // If more than 1 day has passed, streak is broken
  return diffDays > 1
}

/**
 * Calculates and updates streak based on last bet date
 * @param streak Current streak object
 * @returns Updated streak object
 */
export function calculateStreak(streak: DailyStreak): DailyStreak {
  const today = new Date().toISOString().split('T')[0]
  const lastBetDay = streak.lastBetDate.split('T')[0]
  
  // If no last bet date, initialize streak
  if (!streak.lastBetDate) {
    return {
      currentStreak: 0,
      lastBetDate: today,
      longestStreak: 0,
    }
  }
  
  // Check if day was missed
  if (hasMissedDay(streak.lastBetDate)) {
    return {
      currentStreak: 0,
      lastBetDate: today,
      longestStreak: Math.max(streak.longestStreak, streak.currentStreak),
    }
  }
  
  // If same day, don't increment
  if (lastBetDay === today) {
    return streak
  }
  
  // Increment streak (new day, but consecutive)
  const newStreak = streak.currentStreak + 1
  return {
    currentStreak: newStreak,
    lastBetDate: today,
    longestStreak: Math.max(streak.longestStreak, newStreak),
  }
}

/**
 * Calculates Cheese Rank based on combined score (VP + wins * multiplier)
 * @param vpBalance Current VP balance
 * @param totalWins Total number of wins
 * @returns Cheese rank
 */
export function calculateRank(vpBalance: number, totalWins: number): CheeseRank {
  // Combined score: VP balance + (wins * 100)
  const combinedScore = vpBalance + (totalWins * 100)
  
  if (combinedScore >= 15000) {
    return 'King of Cheese'
  } else if (combinedScore >= 5000) {
    return 'Gorgonzola'
  } else if (combinedScore >= 1000) {
    return 'Brie'
  } else {
    return 'Cheddar'
  }
}

/**
 * Calculates streak bonus VP
 * @param streak Current streak count
 * @returns Bonus VP amount (50 VP for 3+ day streak)
 */
export function calculateStreakBonus(streak: number): number {
  if (streak >= 3) {
    return 50
  }
  return 0
}

/**
 * Gets rank display info (color, emoji, etc.)
 * @param rank Cheese rank
 * @returns Display information
 */
export function getRankInfo(rank: CheeseRank) {
  const rankInfo = {
    Cheddar: {
      emoji: '🧀',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      borderColor: 'border-yellow-400/50',
    },
    Brie: {
      emoji: '🧀',
      color: 'text-yellow-300',
      bgColor: 'bg-yellow-300/20',
      borderColor: 'border-yellow-300/50',
    },
    Gorgonzola: {
      emoji: '🧀',
      color: 'text-blue-300',
      bgColor: 'bg-blue-300/20',
      borderColor: 'border-blue-300/50',
    },
    'King of Cheese': {
      emoji: '👑',
      color: 'text-neon-yellow',
      bgColor: 'bg-neon-yellow/20',
      borderColor: 'border-neon-yellow/50',
    },
  }
  
  return rankInfo[rank]
}

