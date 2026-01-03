import { createPublicClient, http, type PublicClient } from 'viem'
import { soneiumMinato } from '../soneium-config'

/**
 * Blockchain Service Interface and Implementation
 * 
 * TODO: Replace this mock service with Startale AA SDK for Soneium Minato Testnet integration.
 * 
 * This interface prepares the codebase for Account Abstraction (AA) integration.
 * The mock implementation simulates blockchain operations for MVP demonstration.
 * 
 * Currently uses viem to connect to Soneium Minato Testnet for network awareness.
 */

// Create public client for Soneium Minato Testnet
const publicClient: PublicClient = createPublicClient({
  chain: soneiumMinato,
  transport: http(),
})

/**
 * Interface for blockchain operations
 * This will be replaced with Startale AA SDK implementation
 */
export interface IBlockchainService {
  /**
   * Mints VP (Vibe Points) on-chain
   * @param amount Amount of VP to mint
   */
  mintVP(amount: number): Promise<void>

  /**
   * Records a bet transaction on-chain
   * @param marketId Market identifier
   * @param amount Bet amount in VP
   * @param side Bet side ('yes' or 'no')
   */
  recordBet(marketId: string, amount: number, side: string): Promise<void>
}

/**
 * Mock Blockchain Service Implementation
 * 
 * This mock service simulates blockchain operations by:
 * - Logging actions to console (simulating transaction logs)
 * - Using async delays to simulate network latency
 * - Updating local state via callbacks
 * 
 * TODO: Replace with Startale AA SDK for Soneium Minato Testnet integration.
 */
export class MockBlockchainService implements IBlockchainService {
  /**
   * Simulates minting VP on-chain
   */
  async mintVP(amount: number): Promise<void> {
    // Simulate network delay (200-500ms)
    const delay = 200 + Math.random() * 300
    await new Promise(resolve => setTimeout(resolve, delay))

    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
    
    console.log(`[Blockchain Mock] Minting ${amount} VP`)
    console.log(`[Blockchain Mock] Transaction Hash: ${txHash}`)
    console.log(`[Blockchain Mock] Status: Confirmed`)
    
    // In real implementation, this would call Startale AA SDK
    // await startaleSDK.mintVP(amount)
  }

  /**
   * Simulates recording a bet on-chain
   */
  async recordBet(marketId: string, amount: number, side: string): Promise<void> {
    // Simulate network delay (200-500ms)
    const delay = 200 + Math.random() * 300
    await new Promise(resolve => setTimeout(resolve, delay))

    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
    
    console.log(`[Blockchain Mock] Recording bet: Market ${marketId}, ${side}, ${amount} VP`)
    console.log(`[Blockchain Mock] Transaction Hash: ${txHash}`)
    console.log(`[Blockchain Mock] Status: Confirmed`)
    
    // In real implementation, this would call Startale AA SDK
    // await startaleSDK.recordBet({ marketId, amount, side })
  }
}

// Export singleton instance
export const mockBlockchainService = new MockBlockchainService()

// Mock wallet address generator (for profile display)
function generateMockAddress(): string {
  const chars = '0123456789abcdef'
  return '0x' + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/**
 * Gets the user's smart wallet address (sponsored AA wallet)
 * Checks localStorage first, then generates a deterministic address if not found
 * @returns Wallet address string
 */
export async function getWalletAddress(): Promise<string> {
  // Check localStorage first (set by LoginModal)
  if (typeof window !== 'undefined') {
    const storedAddress = localStorage.getItem('vibecheese-smart-wallet')
    if (storedAddress) {
      return storedAddress
    }
  }

  // Simulate network delay (100-200ms)
  const delay = 100 + Math.random() * 100
  await new Promise(resolve => setTimeout(resolve, delay))

  // Generate deterministic address based on session (fallback)
  // This ensures consistency across page refreshes if no login occurred
  const sessionId = typeof window !== 'undefined' 
    ? sessionStorage.getItem('vibecheese-session-id') || `session-${Date.now()}`
    : `session-${Date.now()}`
  
  if (typeof window !== 'undefined' && !sessionStorage.getItem('vibecheese-session-id')) {
    sessionStorage.setItem('vibecheese-session-id', sessionId)
  }

  // Generate deterministic address from session ID
  let hash = 0
  for (let i = 0; i < sessionId.length; i++) {
    const char = sessionId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0')
  const address = '0x' + hex.repeat(5).substring(0, 40)

  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('vibecheese-smart-wallet', address)
  }

  return address
}

/**
 * Gets the current block number from Soneium Minato Testnet
 * @returns Current block number, or null if connection fails
 */
export async function getBlockNumber(): Promise<bigint | null> {
  try {
    const blockNumber = await publicClient.getBlockNumber()
    return blockNumber
  } catch (error) {
    console.error('[Blockchain] Failed to fetch block number:', error)
    return null
  }
}

/**
 * Checks connection status to Soneium Minato Testnet
 * @returns true if connected, false otherwise
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await publicClient.getBlockNumber()
    return true
  } catch (error) {
    console.error('[Blockchain] Connection check failed:', error)
    return false
  }
}

