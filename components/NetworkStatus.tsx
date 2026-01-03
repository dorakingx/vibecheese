"use client"

import { useEffect, useState } from 'react'
import { getBlockNumber, checkConnection } from '@/lib/services/blockchain'

export function NetworkStatus() {
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isBlockUpdating, setIsBlockUpdating] = useState(false)

  useEffect(() => {
    let previousBlock: bigint | null = null
    
    const updateStatus = async () => {
      try {
        const connected = await checkConnection()
        setIsConnected(connected)
        
        if (connected) {
          const block = await getBlockNumber()
          // Check if block number changed to trigger flash animation
          if (block !== null && block !== previousBlock) {
            setIsBlockUpdating(true)
            setTimeout(() => setIsBlockUpdating(false), 500)
          }
          previousBlock = block
          setBlockNumber(block)
        } else {
          setBlockNumber(null)
          previousBlock = null
        }
      } catch (error) {
        console.error('[NetworkStatus] Error updating status:', error)
        setIsConnected(false)
        setBlockNumber(null)
        previousBlock = null
      } finally {
        setIsLoading(false)
      }
    }

    // Initial check
    updateStatus()

    // Update every 4 seconds for real-time feel
    const interval = setInterval(updateStatus, 4000)

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
              Live on Soneium Minato
              {blockNumber !== null && (
                <span className="ml-1">
                  <span className="mx-1">|</span>
                  <span className={`font-mono ${isBlockUpdating ? 'block-flash' : ''}`}>
                    Block: #{blockNumber.toString()}
                  </span>
                </span>
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

