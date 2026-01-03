"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Bet, Market, DailyStreak, CheeseRank } from '@/types'
import { spendVP, earnVP as vpEarnVP } from './services/vpService'
import { calculateStreak, calculateStreakBonus, calculateRank } from './services/gamificationService'
import { signMessage } from './services/blockchain'

interface VibePointsState {
  vpBalance: number
  bets: Bet[]
  markets: Market[]
  dailyStreak: DailyStreak
  bet: (marketId: string, side: 'yes' | 'no', amount: number) => Promise<void>
  earnVP: (amount: number) => Promise<void>
  getBalance: () => number
  getBetHistory: () => Bet[]
  getRank: () => CheeseRank
  checkAndUpdateStreak: () => void
  incrementStreak: () => void
  updateMarket: (marketId: string, updates: Partial<Market>) => void
  initializeMarkets: (markets: Market[]) => void
  resolveMarket: (marketId: string, outcome: 'yes' | 'no') => void
}

const INITIAL_VP = 1000

const INITIAL_STREAK: DailyStreak = {
  currentStreak: 0,
  lastBetDate: '',
  longestStreak: 0,
}

export const useVibePointsStore = create<VibePointsState>()(
  persist(
    (set, get) => ({
      vpBalance: INITIAL_VP,
      bets: [],
      markets: [],
      dailyStreak: INITIAL_STREAK,

      bet: async (marketId: string, side: 'yes' | 'no', amount: number) => {
        const state = get()
        if (amount < 10) {
          throw new Error('Minimum bet is 10 VP')
        }
        if (amount > state.vpBalance) {
          throw new Error('Insufficient VP balance')
        }

        const newBet: Bet = {
          id: `bet-${Date.now()}-${Math.random()}`,
          marketId,
          side,
          amount,
          timestamp: new Date(),
          resolved: false,
        }

        // Spend VP via service (records on-chain)
        const success = await spendVP(newBet)
        if (!success) {
          throw new Error('Failed to record bet on blockchain')
        }

        // Sign message with burner wallet (hidden capability for judges)
        const message = `Bet placed on Market ${marketId}: ${side} ${amount} VP`
        await signMessage(message).catch((error) => {
          // Don't fail bet if signing fails, just log
          console.warn('[Store] Failed to sign bet message:', error)
        })

        // Update market betting totals
        const market = state.markets.find(m => m.id === marketId)
        if (market) {
          const updatedMarket = {
            ...market,
            yesBets: side === 'yes' ? market.yesBets + amount : market.yesBets,
            noBets: side === 'no' ? market.noBets + amount : market.noBets,
            totalVP: market.totalVP + amount,
          }

          // Update streak (calculateStreak handles incrementing if it's a new day)
          let updatedStreak = calculateStreak(state.dailyStreak)
          // If first bet ever, start streak at 1
          if (!state.dailyStreak.lastBetDate && updatedStreak.currentStreak === 0) {
            updatedStreak = { ...updatedStreak, currentStreak: 1, longestStreak: 1 }
          }
          const streakBonus = calculateStreakBonus(updatedStreak.currentStreak)
          
          set({
            vpBalance: state.vpBalance - amount + streakBonus,
            bets: [...state.bets, newBet],
            markets: state.markets.map(m => m.id === marketId ? updatedMarket : m),
            dailyStreak: updatedStreak,
          })

          // If streak bonus was granted, mint it on-chain
          if (streakBonus > 0) {
            await vpEarnVP(streakBonus)
          }
        } else {
          // Update streak (calculateStreak handles incrementing if it's a new day)
          let updatedStreak = calculateStreak(state.dailyStreak)
          // If first bet ever, start streak at 1
          if (!state.dailyStreak.lastBetDate && updatedStreak.currentStreak === 0) {
            updatedStreak = { ...updatedStreak, currentStreak: 1, longestStreak: 1 }
          }
          const streakBonus = calculateStreakBonus(updatedStreak.currentStreak)
          
          set({
            vpBalance: state.vpBalance - amount + streakBonus,
            bets: [...state.bets, newBet],
            dailyStreak: updatedStreak,
          })

          // If streak bonus was granted, mint it on-chain
          if (streakBonus > 0) {
            await vpEarnVP(streakBonus)
          }
        }
      },

      earnVP: async (amount: number) => {
        // Earn VP via service (mints on-chain)
        await vpEarnVP(amount)
        set((state) => ({
          vpBalance: state.vpBalance + amount,
        }))
      },

      getBalance: () => {
        return get().vpBalance
      },

      getBetHistory: () => {
        return get().bets
      },

      getRank: () => {
        const state = get()
        const totalWins = state.bets.filter(b => b.resolved && b.won).length
        return calculateRank(state.vpBalance, totalWins)
      },

      checkAndUpdateStreak: () => {
        const state = get()
        const updatedStreak = calculateStreak(state.dailyStreak)
        set({ dailyStreak: updatedStreak })
      },

      incrementStreak: () => {
        const state = get()
        const updatedStreak = calculateStreak(state.dailyStreak)
        set({
          dailyStreak: {
            ...updatedStreak,
            currentStreak: updatedStreak.currentStreak + 1,
          },
        })
      },

      updateMarket: (marketId: string, updates: Partial<Market>) => {
        set((state) => ({
          markets: state.markets.map(m =>
            m.id === marketId ? { ...m, ...updates } : m
          ),
        }))
      },

      initializeMarkets: (markets: Market[]) => {
        set((state) => {
          // Only initialize if markets array is empty
          if (state.markets.length === 0) {
            return { markets }
          }
          return state
        })
      },

      resolveMarket: (marketId: string, outcome: 'yes' | 'no') => {
        const state = get()
        const market = state.markets.find(m => m.id === marketId)
        if (!market || market.resolved) return

        // Calculate winnings for winners
        const winningBets = state.bets.filter(
          b => b.marketId === marketId && b.side === outcome && !b.resolved
        )
        const losingBets = state.bets.filter(
          b => b.marketId === marketId && b.side !== outcome && !b.resolved
        )

        const totalLosingVP = losingBets.reduce((sum, bet) => sum + bet.amount, 0)
        const totalWinningVP = winningBets.reduce((sum, bet) => sum + bet.amount, 0)

        let newBalance = state.vpBalance
        const updatedBets = state.bets.map(bet => {
          if (bet.marketId === marketId && !bet.resolved) {
            if (bet.side === outcome) {
              // Winner: get back bet + proportional share of losing pool
              const share = totalWinningVP > 0 ? (bet.amount / totalWinningVP) : 0
              const winnings = bet.amount + (totalLosingVP * share)
              // Note: bet.amount was already deducted, so we add back the full winnings
              newBalance += winnings
              return { ...bet, resolved: true, won: true }
            } else {
              // Loser: bet is already deducted, nothing to add back
              return { ...bet, resolved: true, won: false }
            }
          }
          return bet
        })

        set({
          vpBalance: newBalance,
          bets: updatedBets,
          markets: state.markets.map(m =>
            m.id === marketId
              ? { ...m, resolved: true, outcome }
              : m
          ),
        })
      },
    }),
    {
      name: 'vibecheese-storage',
    }
  )
)

