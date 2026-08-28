/**
 * DCAManager ABI definition
 * Direct export matching backend/abi/DCAManager.json
 */

export const DCA_MANAGER_ABI = [
  {
    "type": "function",
    "name": "createStrategy",
    "inputs": [
      { "name": "asset", "type": "address", "internalType": "address" },
      { "name": "targetAsset", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" },
      { "name": "frequency", "type": "uint256", "internalType": "uint256" },
      { "name": "maxDelay", "type": "uint256", "internalType": "uint256" },
      { "name": "maxSlippage", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "strategyId", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getStrategy",
    "inputs": [
      { "name": "strategyId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct DCAManager.Strategy",
        "components": [
          { "name": "owner", "type": "address", "internalType": "address" },
          { "name": "asset", "type": "address", "internalType": "address" },
          { "name": "targetAsset", "type": "address", "internalType": "address" },
          { "name": "amount", "type": "uint256", "internalType": "uint256" },
          { "name": "frequency", "type": "uint256", "internalType": "uint256" },
          { "name": "maxDelay", "type": "uint256", "internalType": "uint256" },
          { "name": "maxSlippage", "type": "uint256", "internalType": "uint256" },
          { "name": "delayCount", "type": "uint256", "internalType": "uint256" },
          { "name": "lastExecuted", "type": "uint256", "internalType": "uint256" },
          { "name": "nextDca", "type": "uint256", "internalType": "uint256" },
          { "name": "totalInvested", "type": "uint256", "internalType": "uint256" },
          { "name": "totalExecuted", "type": "uint256", "internalType": "uint256" },
          { "name": "intendedAllocation", "type": "uint256", "internalType": "uint256" },
          { "name": "actualAllocation", "type": "uint256", "internalType": "uint256" },
          { "name": "active", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isDue",
    "inputs": [
      { "name": "strategyId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isForced",
    "inputs": [
      { "name": "strategyId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "StrategyCreated",
    "inputs": [
      { "name": "strategyId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "asset", "type": "address", "indexed": false, "internalType": "address" },
      { "name": "targetAsset", "type": "address", "indexed": false, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "frequency", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "maxDelay", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "maxSlippage", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  }
] as const;
