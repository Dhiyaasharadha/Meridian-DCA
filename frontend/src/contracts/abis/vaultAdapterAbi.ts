/**
 * VaultAdapter ABI definition
 */

export const VAULT_ADAPTER_ABI = [
  {
    inputs: [{ internalType: 'bytes32', name: 'strategyId', type: 'bytes32' }],
    name: 'getYield',
    outputs: [
      { internalType: 'uint256', name: 'principal', type: 'uint256' },
      { internalType: 'uint256', name: 'vaultBalance', type: 'uint256' },
      { internalType: 'uint256', name: 'yieldEarned', type: 'uint256' },
      { internalType: 'uint256', name: 'yieldPercentageBps', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
