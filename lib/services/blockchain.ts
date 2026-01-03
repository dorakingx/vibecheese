/**
 * Blockchain Service Interface and Implementation
 * 
 * TODO: Replace this mock service with Startale AA SDK for Soneium Minato Testnet integration.
 * 
 * This interface prepares the codebase for Account Abstraction (AA) integration.
 * The mock implementation simulates blockchain operations for MVP demonstration.
 */

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

// Cache wallet address for consistency
let cachedWalletAddress: string | null = null

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

