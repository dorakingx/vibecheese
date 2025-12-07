"use client"

import { useVibePointsStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Coins, TrendingUp, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function ProfilePage() {
  const { vpBalance, bets } = useVibePointsStore()

  const totalBets = bets.length
  const resolvedBets = bets.filter(b => b.resolved)
  const wonBets = resolvedBets.filter(b => b.won)
  const winRate = resolvedBets.length > 0 
    ? Math.round((wonBets.length / resolvedBets.length) * 100) 
    : 0
  const totalWagered = bets.reduce((sum, bet) => sum + bet.amount, 0)

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-6 w-6 text-neon-blue" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Profile
          </h1>
        </div>
      </div>

      {/* VP Balance Card */}
      <Card className="mb-6 border-neon-blue/30 bg-gradient-to-br from-card to-secondary/20">
        <CardHeader>
          <CardDescription>Your Balance</CardDescription>
          <CardTitle className="text-4xl font-bold text-neon-blue flex items-center gap-2">
            <Coins className="h-8 w-8" />
            {vpBalance.toLocaleString()} VP
          </CardTitle>
        </CardHeader>
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

