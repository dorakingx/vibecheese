"use client"

import { useVibePointsStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { getRankInfo } from '@/lib/services/gamificationService'
import { Flame } from 'lucide-react'

export function GamificationWidget() {
  const { getRank, dailyStreak } = useVibePointsStore()
  const rank = getRank()
  const rankInfo = getRankInfo(rank)

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Rank Badge */}
      <Badge
        variant="outline"
        className={`${rankInfo.bgColor} ${rankInfo.borderColor} border ${rankInfo.color} px-3 py-1.5`}
      >
        <span className="mr-1.5 text-base">{rankInfo.emoji}</span>
        <span className="font-semibold">{rank}</span>
      </Badge>

      {/* Daily Streak - Always visible */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
        dailyStreak.currentStreak > 0
          ? 'bg-gradient-to-r from-cheese-yellow/20 to-soneium-blue/20 border-cheese-yellow/30'
          : 'bg-secondary/50 border-border/50'
      }`}>
        <Flame className={`h-5 w-5 ${
          dailyStreak.currentStreak > 0 ? 'text-cheese-yellow animate-pulse' : 'text-muted-foreground'
        }`} />
        <span className="text-sm font-semibold text-foreground">
          {dailyStreak.currentStreak > 0 ? (
            <>
              {dailyStreak.currentStreak} day{dailyStreak.currentStreak !== 1 ? 's' : ''}
            </>
          ) : (
            <span className="text-muted-foreground">Start your streak!</span>
          )}
        </span>
      </div>
    </div>
  )
}

