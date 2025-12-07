"use client"

import { Market } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useVibePointsStore } from '@/lib/store'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface BettingModalProps {
  market: Market
  isOpen: boolean
  onClose: () => void
}

function calculateOdds(yesBets: number, noBets: number): { yes: number; no: number } {
  const total = yesBets + noBets
  if (total === 0) return { yes: 50, no: 50 }
  return {
    yes: Math.round((yesBets / total) * 100),
    no: Math.round((noBets / total) * 100),
  }
}

function calculatePotentialPayout(
  betAmount: number,
  side: 'yes' | 'no',
  market: Market
): number {
  if (market.totalVP === 0) return betAmount * 2 // Even odds if no bets
  
  const totalLosingSide = side === 'yes' ? market.noBets : market.yesBets
  const totalWinningSide = side === 'yes' ? market.yesBets : market.noBets
  const newTotalWinningSide = totalWinningSide + betAmount
  
  if (newTotalWinningSide === 0) return betAmount
  
  // Calculate share of losing pool
  const share = betAmount / newTotalWinningSide
  const payout = betAmount + (totalLosingSide * share)
  
  return Math.round(payout)
}

export function BettingModal({ market, isOpen, onClose }: BettingModalProps) {
  const { vpBalance, bet, markets } = useVibePointsStore()
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no' | null>(null)
  const [betAmount, setBetAmount] = useState([100])
  const [isPlacingBet, setIsPlacingBet] = useState(false)

  // Get latest market data from store
  const latestMarket = markets.find(m => m.id === market.id) || market
  const odds = calculateOdds(latestMarket.yesBets, latestMarket.noBets)
  const minBet = 10
  const maxBet = Math.min(vpBalance, 10000)
  const currentBet = betAmount[0]

  const handleBet = async () => {
    if (!selectedSide || currentBet < minBet || currentBet > vpBalance) {
      return
    }

    setIsPlacingBet(true)
    try {
      bet(latestMarket.id, selectedSide, currentBet)
      onClose()
      // Reset state
      setSelectedSide(null)
      setBetAmount([100])
    } catch (error) {
      console.error('Error placing bet:', error)
      alert(error instanceof Error ? error.message : 'Failed to place bet')
    } finally {
      setIsPlacingBet(false)
    }
  }

  const potentialPayout = selectedSide
    ? calculatePotentialPayout(currentBet, selectedSide, latestMarket)
    : 0

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedSide(null)
      setBetAmount([100])
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{latestMarket.topic}</DialogTitle>
          <DialogDescription>{latestMarket.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Odds */}
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg border-2 border-neon-blue/30 bg-secondary/50 p-4 text-center">
              <div className="text-xs text-muted-foreground mb-1">Vibe In</div>
              <div className="text-2xl font-bold text-neon-blue">{odds.yes}%</div>
            </div>
            <div className="flex-1 rounded-lg border-2 border-neon-purple/30 bg-secondary/50 p-4 text-center">
              <div className="text-xs text-muted-foreground mb-1">Vibe Out</div>
              <div className="text-2xl font-bold text-neon-purple">{odds.no}%</div>
            </div>
          </div>

          {/* Side Selection */}
          <div className="flex gap-2">
            <Button
              variant={selectedSide === 'yes' ? 'neon' : 'outline'}
              className="flex-1"
              onClick={() => setSelectedSide('yes')}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Vibe In
            </Button>
            <Button
              variant={selectedSide === 'no' ? 'neon' : 'outline'}
              className="flex-1"
              onClick={() => setSelectedSide('no')}
            >
              <TrendingDown className="mr-2 h-4 w-4" />
              Vibe Out
            </Button>
          </div>

          {/* Bet Amount Slider */}
          {selectedSide && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Bet Amount</span>
                  <span className="font-semibold">{currentBet} VP</span>
                </div>
                <Slider
                  value={betAmount}
                  onValueChange={setBetAmount}
                  min={minBet}
                  max={maxBet}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{minBet} VP</span>
                  <span>Balance: {vpBalance} VP</span>
                  <span>{maxBet} VP</span>
                </div>
              </div>

              {/* Potential Payout */}
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  Potential Payout
                </div>
                <div className="text-xl font-bold text-neon-blue">
                  {potentialPayout} VP
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Profit: +{potentialPayout - currentBet} VP
                </div>
              </div>
            </div>
          )}

          {/* Place Bet Button */}
          <Button
            variant="neon"
            className="w-full"
            onClick={handleBet}
            disabled={!selectedSide || currentBet < minBet || currentBet > vpBalance || isPlacingBet}
          >
            {isPlacingBet ? 'Placing Bet...' : `Place Bet (${currentBet} VP)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

