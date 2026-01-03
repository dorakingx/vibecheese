"use client"

import { useEffect, useState } from 'react'
import { useVibePointsStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Coins, TrendingUp, Clock, Wallet, Info } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { getWalletAddress } from '@/lib/services/blockchain'
import { getRankInfo, calculateRank } from '@/lib/services/gamificationService'
import { GamificationWidget } from '@/components/GamificationWidget'
import type { CheeseRank } from '@/types'

export default function ProfilePage() {
  const { vpBalance, bets, getRank } = useVibePointsStore()
  const [walletAddress, setWalletAddress] = useState<string>('')

  useEffect(() => {
    getWalletAddress().then(setWalletAddress)
  }, [])

  const rank = getRank()
  const rankInfo = getRankInfo(rank)
  const totalBets = bets.length
  const resolvedBets = bets.filter(b => b.resolved)
  const wonBets = resolvedBets.filter(b => b.won)
  const winRate = resolvedBets.length > 0 
    ? Math.round((wonBets.length / resolvedBets.length) * 100) 
    : 0
  const totalWagered = bets.reduce((sum, bet) => sum + bet.amount, 0)

  // Calculate rank progress
  const combinedScore = vpBalance + (wonBets.length * 100)
  const rankThresholds: Record<CheeseRank, { min: number; next: CheeseRank | null; nextMin: number }> = {
    'Baby Cheese': { min: 0, next: 'Cheddar Knight', nextMin: 1000 },
    'Cheddar Knight': { min: 1000, next: 'Gorgonzola King', nextMin: 5000 },
    'Gorgonzola King': { min: 5000, next: null, nextMin: Infinity },
  }
  
  const currentThreshold = rankThresholds[rank]
  const progressToNext = currentThreshold.next
    ? Math.max(0, Math.min(100, ((combinedScore - currentThreshold.min) / (currentThreshold.nextMin - currentThreshold.min)) * 100))
    : 100
  const vpNeeded = currentThreshold.next
    ? Math.max(0, currentThreshold.nextMin - combinedScore)
    : 0

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-6 w-6 text-neon-blue" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue via-neon-yellow to-neon-purple bg-clip-text text-transparent">
            Profile
          </h1>
        </div>
        <div className="mt-4">
          <GamificationWidget />
        </div>
      </div>

      {/* VP Balance Card */}
      <Card className="mb-6 border-neon-blue/30 bg-gradient-to-br from-card to-secondary/20">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardDescription>Your Balance</CardDescription>
            <Badge 
              variant="outline" 
              className={`${rankInfo.bgColor} ${rankInfo.borderColor} border ${rankInfo.color}`}
            >
              <span className="mr-1">{rankInfo.emoji}</span>
              {rank}
            </Badge>
          </div>
          <CardTitle className="text-4xl font-bold text-neon-blue flex items-center gap-2">
            <Coins className="h-8 w-8" />
            {vpBalance.toLocaleString()} VP
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Rank Progress */}
      {currentThreshold.next && (
        <Card className="mb-6 border-cheese-yellow/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cheese-yellow" />
              Rank Progress
            </CardTitle>
            <CardDescription>
              {vpNeeded > 0 ? (
                <>
                  {vpNeeded.toLocaleString()} VP until <span className="font-semibold text-cheese-yellow">{currentThreshold.next}</span>
                </>
              ) : (
                <>You've reached the maximum rank!</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{rank}</span>
                <span className="text-muted-foreground">{currentThreshold.next}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cheese-yellow to-soneium-blue transition-all duration-500 ease-out"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Combined Score: {combinedScore.toLocaleString()} / {currentThreshold.nextMin.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Account */}
      <Card className="mb-6 border-soneium-blue/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-soneium-blue" />
            Your Smart Account
            <div className="group relative">
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg text-xs text-popover-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Transactions are sponsored (Gasless) via Account Abstraction
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></div>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            Powered by Account Abstraction on Soneium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm break-all border border-soneium-blue/20">
            {walletAddress || 'Loading...'}
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <span className="text-green-500">✓</span>
            Gasless transactions enabled
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Bets</CardDescription>
            <CardTitle className="text-2xl">{totalBets}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Win Rate</CardDescription>
            <CardTitle className="text-2xl">{winRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Wins</CardDescription>
            <CardTitle className="text-2xl text-neon-blue">{wonBets.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Wagered</CardDescription>
            <CardTitle className="text-2xl">{totalWagered.toLocaleString()} VP</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Betting History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Betting History
          </CardTitle>
          <CardDescription>
            Your recent predictions and outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bets.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No bets yet</p>
              <p className="text-sm mt-2">Start vibing on the home page!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bets.slice().reverse().map((bet) => (
                <div
                  key={bet.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={bet.side === 'yes' ? 'neon' : 'secondary'}>
                        {bet.side === 'yes' ? 'Vibe In' : 'Vibe Out'}
                      </Badge>
                      {bet.resolved && (
                        <Badge variant={bet.won ? 'default' : 'destructive'}>
                          {bet.won ? 'Won' : 'Lost'}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(bet.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{bet.amount} VP</div>
                    {!bet.resolved && (
                      <div className="text-xs text-muted-foreground">Pending</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

