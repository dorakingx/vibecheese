import { defineChain } from 'viem'

/**
 * Soneium Minato Testnet Configuration
 * Chain ID: 1946
 * RPC URL: https://rpc.minato.soneium.org/
 */
export const soneiumMinato = defineChain({
  id: 1946,
  name: 'Soneium Minato',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.minato.soneium.org/'],
    },
    public: {
      http: ['https://rpc.minato.soneium.org/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Soneium Explorer',
      url: 'https://explorer.minato.soneium.org',
    },
  },
  testnet: true,
})

