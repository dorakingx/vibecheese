import { mockBlockchainService } from './blockchain'
import { Bet } from '@/types'

/**
 * VP Service
 * Handles VP operations and delegates to blockchain service
 */

/**
 * Mints VP on-chain
 * @param amount Amount of VP to mint
 * @returns Amount minted
 */
export async function mintVP(amount: number): Promise<number> {
  await mockBlockchainService.mintVP(amount)
  return amount
}

/**
 * Earns VP (login rewards, bonuses, etc.)
 * This also mints on-chain
 * @param amount Amount of VP to earn
 * @returns Amount earned
 */
export async function earnVP(amount: number): Promise<number> {
  // Earned VP is also minted on-chain
  return await mintVP(amount)
}

/**
 * Spends VP for a bet
 * Records the bet on-chain
 * @param bet Bet object
 * @returns true if successful
 */
export async function spendVP(bet: Bet): Promise<boolean> {
  try {
    await mockBlockchainService.recordBet(bet.marketId, bet.amount, bet.side)
    return true
  } catch (error) {
    console.error('Error spending VP:', error)
    return false
  }
}

