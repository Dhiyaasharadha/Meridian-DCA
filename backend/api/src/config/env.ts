import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  RPC_URL: process.env.RPC_URL || 'http://127.0.0.1:8545',
  CHAIN_ID: Number(process.env.CHAIN_ID || 31337),
  PRIVATE_KEY: (process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80') as `0x${string}`,
  PORT: Number(process.env.API_PORT || 4000),

  // Addresses
  DCA_MANAGER_ADDRESS: (process.env.DCA_MANAGER_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`,
  VAULT_ADAPTER_ADDRESS: (process.env.VAULT_ADAPTER_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512') as `0x${string}`,
  YIELD_VAULT_ADDRESS: (process.env.YIELD_VAULT_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0') as `0x${string}`,
  DCA_HOOK_ADDRESS: (process.env.DCA_HOOK_ADDRESS || '0xCf7Ed3AccA5a467e9e75457215744945220f6844') as `0x${string}`,
  MARKET_ORACLE_ADDRESS: (process.env.MARKET_ORACLE_ADDRESS || '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9') as `0x${string}`,
};
