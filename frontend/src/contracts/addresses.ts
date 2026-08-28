/**
 * Meridian-DCA / YieldGuard AI - Contract Addresses Configuration
 * 
 * Configured for Local Anvil Blockchain (Chain ID 31337)
 * Reads addresses from environment variables or backend deployments/localhost.json.
 */

export const CONTRACT_ADDRESSES = {
  dcaManager: (process.env.NEXT_PUBLIC_DCA_MANAGER_ADDRESS ||
    '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`,

  executionContract: (process.env.NEXT_PUBLIC_EXECUTION_CONTRACT_ADDRESS ||
    '0x9A676e781A523b5d0C0e43731313A708CB607508') as `0x${string}`,

  vaultAdapter: (process.env.NEXT_PUBLIC_VAULT_ADAPTER_ADDRESS ||
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512') as `0x${string}`,

  yieldVault: (process.env.NEXT_PUBLIC_YIELD_VAULT_ADDRESS ||
    '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0') as `0x${string}`,

  dcaHook: (process.env.NEXT_PUBLIC_DCA_HOOK_ADDRESS ||
    '0xCf7Ed3AccA5a467e9e75457215744945220f6844') as `0x${string}`,

  oracle: (process.env.NEXT_PUBLIC_MARKET_ORACLE_ADDRESS ||
    '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9') as `0x${string}`,

  tokens: {
    USDC: (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
      '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707') as `0x${string}`,
    ETH: (process.env.NEXT_PUBLIC_ETH_ADDRESS ||
      '0x0165878A594ca255338adfa4d48449f69242Eb8F') as `0x${string}`,
    BTC: (process.env.NEXT_PUBLIC_BTC_ADDRESS ||
      '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853') as `0x${string}`,
    SOL: (process.env.NEXT_PUBLIC_SOL_ADDRESS ||
      '0x2E234DAe75C793f67A35089C9d99245E1C58470b') as `0x${string}`,
  },
} as const;

export const SUPPORTED_ASSETS = [
  { symbol: 'BTC', name: 'Wrapped Bitcoin', address: CONTRACT_ADDRESSES.tokens.BTC, icon: '₿', color: '#f7931a' },
  { symbol: 'ETH', name: 'Wrapped Ethereum', address: CONTRACT_ADDRESSES.tokens.ETH, icon: 'Ξ', color: '#627eea' },
  { symbol: 'SOL', name: 'Wrapped Solana', address: CONTRACT_ADDRESSES.tokens.SOL, icon: 'S', color: '#14f195' },
] as const;

export type SupportedAssetSymbol = typeof SUPPORTED_ASSETS[number]['symbol'];
