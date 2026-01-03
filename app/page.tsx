"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { MarketCard } from '@/components/MarketCard'
import { GamificationWidget } from '@/components/GamificationWidget'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { LoginModal } from '@/components/LoginModal'
import { useVibePointsStore } from '@/lib/store'
import { mockMarkets } from '@/lib/mock-data'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { markets, initializeMarkets } = useVibePointsStore()
  const [logoError, setLogoError] = useState(false)
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  useEffect(() => {
    // Initialize markets if empty
    const store = useVibePointsStore.getState()
    if (store.markets.length === 0) {
      initializeMarkets(mockMarkets)
    }

    // Check if user has logged in (has smart wallet)
    if (typeof window !== 'undefined') {
      const hasSmartWallet = localStorage.getItem('vibecheese-smart-wallet')
      if (!hasSmartWallet) {
        setIsLoginOpen(true)
      }
    }
  }, [initializeMarkets])

  const handleLogin = (provider: 'google' | 'sony') => {
    // Login handled by LoginModal, just close it
    setIsLoginOpen(false)
  }

  const activeMarkets = markets.length > 0 ? markets : mockMarkets

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {logoError ? (
            <span className="text-3xl h-8 w-8 flex items-center justify-center">🧀</span>
          ) : (
            <Image
              src="/logo/vibecheese-removebg_small.png"
              alt="VibeCheese Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              onError={() => setLogoError(true)}
            />
          )}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cheese-yellow via-soneium-blue to-cheese-yellow bg-clip-text text-transparent">
            VibeCheese 🧀
          </h1>
        </div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-muted-foreground text-sm">
            Predict trends and vibe with the community
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHowToPlayOpen(true)}
            className="touch-target text-soneium-blue hover:text-soneium-blue/80"
          >
            <Info className="h-4 w-4 mr-1" />
            How to Play
          </Button>
        </div>
        <GamificationWidget />
      </div>

      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />

      {/* Markets Feed */}
      <div className="hide-scrollbar">
        {activeMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {/* Empty State */}
      {activeMarkets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="text-6xl mb-4">🧀</span>
          <p className="text-muted-foreground">No active markets yet</p>
        </div>
      )}
    </div>
  )
}

