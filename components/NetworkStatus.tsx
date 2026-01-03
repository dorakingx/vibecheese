"use client"

import { useEffect, useState } from 'react'
import { getBlockNumber, checkConnection } from '@/lib/services/blockchain'

export function NetworkStatus() {
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updateStatus = async () => {
      try {
        const connected = await checkConnection()
        setIsConnected(connected)
        
        if (connected) {
          const block = await getBlockNumber()
          setBlockNumber(block)
        } else {
          setBlockNumber(null)
        }
      } catch (error) {
        console.error('[NetworkStatus] Error updating status:', error)
        setIsConnected(false)
        setBlockNumber(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial check
    updateStatus()

    // Update every 8 seconds
    const interval = setInterval(updateStatus, 8000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm px-4 py-2">
        <div className="container mx-auto flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Connecting to Soneium Minato...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm px-4 py-2">
      <div className="container mx-auto flex items-center justify-center gap-2">
        {isConnected ? (
          <>
            <span className="text-green-500 network-pulse">🟢</span>
            <span className="text-xs text-muted-foreground">
              Soneium Minato (Live)
              {blockNumber !== null && (
                <span className="ml-1 font-mono">(Block: #{blockNumber.toString()})</span>
              )}
            </span>
          </>
        ) : (
          <>
            <span className="text-red-500">🔴</span>
            <span className="text-xs text-muted-foreground">Disconnected</span>
          </>
        )}
      </div>
    </div>
  )
}

