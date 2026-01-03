"use client"

import { User } from '@/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getRankInfo } from '@/lib/services/gamificationService'

interface LeaderboardRowProps {
  user: User
  rank: number
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-400" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-300" />
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />
    default:
      return null
  }
}

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50'
    case 2:
      return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50'
    case 3:
      return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50'
    default:
      return 'bg-card border-border'
  }
}

export function LeaderboardRow({ user, rank }: LeaderboardRowProps) {
  const winRate = user.totalBets > 0 
    ? Math.round((user.totalWins / user.totalBets) * 100) 
    : 0
  
  const cheeseRank = user.rank || 'Cheddar'
  const rankInfo = getRankInfo(cheeseRank)

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border p-4 transition-all hover:shadow-md",
        getRankColor(rank)
      )}
    >
      {/* Rank */}
      <div className="flex w-12 items-center justify-center">
        {getRankIcon(rank) || (
          <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-gradient-to-br from-neon-blue via-neon-yellow to-neon-purple text-white font-bold">
          {user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Gold Cheese Icon for Top 3 */}
          {rank <= 3 && (
            <span className={`text-cheese-yellow ${
              rank === 1 ? 'text-2xl' : 'text-xl'
            }`}>
              🧀
            </span>
          )}
          <h3 className="font-semibold">{user.name}</h3>
          {user.rank && (
            <Badge 
              variant="outline" 
              className={`text-xs ${rankInfo.bgColor} ${rankInfo.borderColor} border ${rankInfo.color}`}
            >
              <span className="mr-1">{rankInfo.emoji}</span>
              {user.rank}
            </Badge>
          )}
          {rank <= 3 && (
            <Badge variant="neon" className="text-xs">
              Top {rank}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
          <span>{user.totalWins}W / {user.totalBets}G</span>
          <span>{winRate}% win rate</span>
        </div>
      </div>

      {/* VP Balance */}
      <div className="text-right">
        <div className="text-lg font-bold text-neon-blue">
          {user.vpBalance.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground">VP</div>
      </div>
    </div>
  )
}

