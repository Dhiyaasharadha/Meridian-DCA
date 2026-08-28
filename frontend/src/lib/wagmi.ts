import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Custom local Anvil chain configuration matching chainId 31337
export const anvilChain = {
  id: 31337,
  name: 'Anvil Localhost',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
} as const;

const publicRpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';

export const config = createConfig({
  chains: [anvilChain, sepolia, mainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [anvilChain.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(publicRpcUrl),
    [mainnet.id]: http(),
  },
});
