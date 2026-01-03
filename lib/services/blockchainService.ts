import { Bet, Transaction } from '@/types'

/**
 * Mock Soneium Blockchain Service
 * Simulates blockchain operations with async delays
 */

// Mock wallet address generator
function generateMockAddress(): string {
  const chars = '0123456789abcdef'
  return '0x' + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// Cache wallet address for consistency
let cachedWalletAddress: string | null = null

/**
 * Simulates minting VP on-chain
 * @param amount Amount of VP to mint
 * @returns Transaction object
 */
export async function mintVP(amount: number): Promise<Transaction> {
  // Simulate network delay (200-500ms)
  const delay = 200 + Math.random() * 300
  await new Promise(resolve => setTimeout(resolve, delay))

  const transaction: Transaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'mint',
    amount,
    timestamp: new Date(),
    hash: `0x${Math.random().toString(16).substr(2, 64)}`,
  }

  console.log(`[Blockchain] Minted ${amount} VP`, transaction)
  return transaction
}

/**
 * Simulates recording a bet on-chain
 * @param bet Bet object to record
 * @returns Transaction object
 */
export async function recordBet(bet: Bet): Promise<Transaction> {
  // Simulate network delay (200-500ms)
  const delay = 200 + Math.random() * 300
  await new Promise(resolve => setTimeout(resolve, delay))

  const transaction: Transaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'bet',
    amount: bet.amount,
    timestamp: new Date(),
    hash: `0x${Math.random().toString(16).substr(2, 64)}`,
  }

  console.log(`[Blockchain] Recorded bet ${bet.id}`, transaction)
  return transaction
}

/**
 * Gets the user's wallet address (sponsored AA wallet)
 * @returns Wallet address string
 */
export async function getWalletAddress(): Promise<string> {
  // Simulate network delay (100-200ms)
  const delay = 100 + Math.random() * 100
  await new Promise(resolve => setTimeout(resolve, delay))

  if (!cachedWalletAddress) {
    cachedWalletAddress = generateMockAddress()
  }

  return cachedWalletAddress
}

/**
 * Simulates checking transaction status
 * @param txHash Transaction hash
 * @returns Transaction status
 */
export async function getTransactionStatus(txHash: string): Promise<'pending' | 'confirmed' | 'failed'> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Mock: all transactions are confirmed after a delay
  return 'confirmed'
}

