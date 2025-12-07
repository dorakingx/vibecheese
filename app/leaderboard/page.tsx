"use client"

import { LeaderboardRow } from '@/components/LeaderboardRow'
import { mockLeaderboardUsers } from '@/lib/mock-data'
import { Trophy } from 'lucide-react'

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-6 w-6 text-neon-blue" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Leaderboard
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Top Vibe Checkers ranked by VP balance
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {mockLeaderboardUsers.map((user, index) => (
          <LeaderboardRow key={user.id} user={user} rank={index + 1} />
        ))}
      </div>
    </div>
  )
}

