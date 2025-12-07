"use client"

import { Market } from '@/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { useState } from 'react'
import { BettingModal } from './BettingModal'

interface MarketCardProps {
  market: Market
}

function formatTimeRemaining(deadline: Date): string {
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  
  if (diff <= 0) return 'Closed'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function calculateOdds(yesBets: number, noBets: number): { yes: number; no: number } {
  const total = yesBets + noBets
  if (total === 0) return { yes: 50, no: 50 }
  return {
    yes: Math.round((yesBets / total) * 100),
    no: Math.round((noBets / total) * 100),
  }
}

export function MarketCard({ market }: MarketCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const odds = calculateOdds(market.yesBets, market.noBets)

  return (
    <>
      <Card className="mb-4 overflow-hidden border-border/50 bg-card transition-all hover:border-neon-blue/50 hover:shadow-lg hover:shadow-neon-blue/10">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-bold leading-tight">
              {market.topic}
            </CardTitle>
            {market.resolved && (
              <Badge variant={market.outcome === 'yes' ? 'neon' : 'secondary'}>
                {market.outcome === 'yes' ? 'Yes' : 'No'}
              </Badge>
            )}
          </div>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            {market.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {/* Odds Display */}
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg bg-secondary/50 p-3">
                <div className="text-xs text-muted-foreground">Vibe In</div>
                <div className="text-lg font-bold text-neon-blue">{odds.yes}%</div>
                <div className="text-xs text-muted-foreground">
                  {market.yesBets.toLocaleString()} VP
                </div>
              </div>
              <div className="flex-1 rounded-lg bg-secondary/50 p-3">
                <div className="text-xs text-muted-foreground">Vibe Out</div>
                <div className="text-lg font-bold text-neon-purple">{odds.no}%</div>
                <div className="text-xs text-muted-foreground">
                  {market.noBets.toLocaleString()} VP
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatTimeRemaining(market.deadline)} remaining</span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant="neon"
            className="w-full"
            onClick={() => setIsModalOpen(true)}
            disabled={market.resolved}
          >
            {market.resolved ? 'Market Closed' : 'Vibe Check'}
          </Button>
        </CardFooter>
      </Card>

      <BettingModal
        market={market}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

