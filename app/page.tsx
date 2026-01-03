"use client"

import { useEffect } from 'react'
import Image from 'next/image'
import { MarketCard } from '@/components/MarketCard'
import { useVibePointsStore } from '@/lib/store'
import { mockMarkets } from '@/lib/mock-data'
import { Sparkles } from 'lucide-react'

export default function Home() {
  const { markets, initializeMarkets } = useVibePointsStore()

  useEffect(() => {
    // Initialize markets if empty
    const store = useVibePointsStore.getState()
    if (store.markets.length === 0) {
      initializeMarkets(mockMarkets)
    }
  }, [initializeMarkets])

  const activeMarkets = markets.length > 0 ? markets : mockMarkets

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Image
            src="/logo/vibecheese-removebg_small.png"
            alt="VibeCheese Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue via-neon-yellow to-neon-purple bg-clip-text text-transparent">
            VibeCheese
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Predict trends and vibe with the community
        </p>
      </div>

      {/* Markets Feed */}
      <div className="hide-scrollbar">
        {activeMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {/* Empty State */}
      {activeMarkets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No active markets yet</p>
        </div>
      )}
    </div>
  )
}

