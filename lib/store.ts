"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Bet, Market } from '@/types'

interface VibePointsState {
  vpBalance: number
  bets: Bet[]
  markets: Market[]
  bet: (marketId: string, side: 'yes' | 'no', amount: number) => void
  earnVP: (amount: number) => void
  getBalance: () => number
  getBetHistory: () => Bet[]
  updateMarket: (marketId: string, updates: Partial<Market>) => void
  initializeMarkets: (markets: Market[]) => void
  resolveMarket: (marketId: string, outcome: 'yes' | 'no') => void
}

const INITIAL_VP = 1000

export const useVibePointsStore = create<VibePointsState>()(
  persist(
    (set, get) => ({
      vpBalance: INITIAL_VP,
      bets: [],
      markets: [],

      bet: (marketId: string, side: 'yes' | 'no', amount: number) => {
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

        // Update market betting totals
        const market = state.markets.find(m => m.id === marketId)
        if (market) {
          const updatedMarket = {
            ...market,
            yesBets: side === 'yes' ? market.yesBets + amount : market.yesBets,
            noBets: side === 'no' ? market.noBets + amount : market.noBets,
            totalVP: market.totalVP + amount,
          }

          set({
            vpBalance: state.vpBalance - amount,
            bets: [...state.bets, newBet],
            markets: state.markets.map(m => m.id === marketId ? updatedMarket : m),
          })
        } else {
          set({
            vpBalance: state.vpBalance - amount,
            bets: [...state.bets, newBet],
          })
        }
      },

      earnVP: (amount: number) => {
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
      name: 'vibecheck-storage',
    }
  )
)

