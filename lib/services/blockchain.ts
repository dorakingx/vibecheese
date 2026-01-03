import { createPublicClient, http, type PublicClient } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import type { PrivateKeyAccount } from 'viem/accounts'
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

/**
 * Creates a burner wallet (real cryptographic account)
 * Generates a random private key and creates an account
 * Stores private key in localStorage for MVP (in production, use proper key management)
 * @returns The wallet address (0x...)
 */
export function createBurnerWallet(): string {
  if (typeof window === 'undefined') {
    throw new Error('createBurnerWallet can only be called in browser environment')
  }

  // Check if burner wallet already exists
  const existingPrivateKey = localStorage.getItem('vibecheese-burner-private-key')
  if (existingPrivateKey) {
    // Return existing address
    const account = privateKeyToAccount(existingPrivateKey as `0x${string}`)
    return account.address
  }

  // Generate new private key
  const privateKey = generatePrivateKey()
  
  // Create account from private key
  const account = privateKeyToAccount(privateKey)
  
  // Store private key in localStorage (MVP-level security)
  // In production, this would use secure key management
  localStorage.setItem('vibecheese-burner-private-key', privateKey)
  localStorage.setItem('vibecheese-smart-wallet', account.address)
  
  console.log('[Blockchain] Created burner wallet:', account.address)
  
  return account.address
}

/**
 * Gets the burner wallet account if it exists
 * @returns PrivateKeyAccount or null
 */
function getBurnerAccount(): PrivateKeyAccount | null {
  if (typeof window === 'undefined') {
    return null
  }

  const privateKey = localStorage.getItem('vibecheese-burner-private-key')
  if (!privateKey) {
    return null
  }

  try {
    return privateKeyToAccount(privateKey as `0x${string}`)
  } catch (error) {
    console.error('[Blockchain] Failed to create account from stored private key:', error)
    return null
  }
}

/**
 * Signs a message using the burner wallet
 * @param message Message to sign
 * @returns Signature string, or null if no wallet exists
 */
export async function signMessage(message: string): Promise<string | null> {
  const account = getBurnerAccount()
  if (!account) {
    console.warn('[Blockchain] No burner wallet found, cannot sign message')
    return null
  }

  try {
    // Sign message using the account
    const signature = await account.signMessage({ message })
    console.log('[Blockchain] Signed message:', message)
    console.log('[Blockchain] Signature:', signature)
    return signature
  } catch (error) {
    console.error('[Blockchain] Failed to sign message:', error)
    return null
  }
}

/**
 * Gets the user's smart wallet address (sponsored AA wallet)
 * Checks for burner wallet first, then falls back to stored address
 * @returns Wallet address string
 */
export async function getWalletAddress(): Promise<string> {
  if (typeof window === 'undefined') {
    return '0x0000000000000000000000000000000000000000'
  }

  // Check for burner wallet first (real cryptographic account)
  const burnerAccount = getBurnerAccount()
  if (burnerAccount) {
    return burnerAccount.address
  }

  // Check localStorage for stored address (set by LoginModal or fallback)
  const storedAddress = localStorage.getItem('vibecheese-smart-wallet')
  if (storedAddress) {
    return storedAddress
  }

  // Simulate network delay (100-200ms)
  const delay = 100 + Math.random() * 100
  await new Promise(resolve => setTimeout(resolve, delay))

  // Generate deterministic address based on session (fallback)
  // This ensures consistency across page refreshes if no login occurred
  const sessionId = sessionStorage.getItem('vibecheese-session-id') || `session-${Date.now()}`
  
  if (!sessionStorage.getItem('vibecheese-session-id')) {
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
  localStorage.setItem('vibecheese-smart-wallet', address)

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

