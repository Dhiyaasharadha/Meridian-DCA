import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvilChain } from '@/lib/wagmi';

export type WalletMode = 'BROWSER_WALLET' | 'LOCAL_ANVIL_DEMO' | 'NO_WALLET' | 'WRONG_NETWORK' | 'ERROR';

export interface WalletInfo {
  mode: WalletMode;
  address: `0x${string}` | null;
  displayLabel: string;
  displaySubLabel?: string;
  shortAddress: string;
  isDemoMode: boolean;
  isConnected: boolean;
  chainId: number | undefined;
  connectBrowserWallet: () => void;
  disconnectWallet: () => void;
  getWalletClient: () => any;
}

const ANVIL_DEMO_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as `0x${string}`;
const ANVIL_DEMO_PRIVATE_KEY = (process.env.NEXT_PUBLIC_ANVIL_DEMO_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80') as `0x${string}`;

export function useWallet(): WalletInfo {
  const wagmiAccount = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [useLocalDemo, setUseLocalDemo] = useState<boolean>(true);

  // Strict Production & Network Safety Conditions (Requirement #3 & #12)
  const isLocalEnv = process.env.NODE_ENV !== 'production';
  const isLocalHost = typeof window === 'undefined' || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1';

  // Anvil fallback is ALLOWED ONLY when NODE_ENV !== production AND host is localhost/127.0.0.1
  const isAnvilDemoAllowed = isLocalEnv && isLocalHost;

  let mode: WalletMode = 'NO_WALLET';
  let address: `0x${string}` | null = null;
  let displayLabel = 'Connect Wallet';
  let displaySubLabel: string | undefined = undefined;
  let isDemoMode = false;
  let isConnected = false;

  if (wagmiAccount.isConnected && wagmiAccount.address) {
    address = wagmiAccount.address as `0x${string}`;
    isConnected = true;
    isDemoMode = false;

    if (wagmiAccount.chainId && wagmiAccount.chainId !== 31337) {
      mode = 'WRONG_NETWORK';
      displayLabel = 'Switch to Anvil';
    } else {
      mode = 'BROWSER_WALLET';
      displayLabel = 'Wallet Connected';
    }
  } else if (isAnvilDemoAllowed && useLocalDemo) {
    // Mode 2 — Local Anvil Demo Wallet
    mode = 'LOCAL_ANVIL_DEMO';
    address = ANVIL_DEMO_ADDRESS;
    isConnected = true;
    isDemoMode = true;
    displayLabel = 'Anvil Demo Wallet';
    displaySubLabel = 'Local Development';
  } else {
    // Mode 3 — No Wallet (e.g. Production or user disconnected demo mode)
    mode = 'NO_WALLET';
    address = null;
    isConnected = false;
    isDemoMode = false;
    displayLabel = 'Connect Wallet';
  }

  const connectBrowserWallet = () => {
    try {
      const injected = connectors.find((c) => c.id === 'injected') || connectors[0];
      if (injected) {
        connect({ connector: injected });
      }
    } catch (err) {
      console.warn('Browser wallet connection failed:', err);
    }
  };

  const disconnectWallet = () => {
    if (wagmiAccount.isConnected) {
      disconnect();
    }
    setUseLocalDemo(false);
  };

  const getWalletClient = () => {
    if (mode === 'LOCAL_ANVIL_DEMO') {
      const account = privateKeyToAccount(ANVIL_DEMO_PRIVATE_KEY);
      return createWalletClient({
        account,
        chain: anvilChain,
        transport: http('http://127.0.0.1:8545'),
      });
    }
    return null; // For BROWSER_WALLET, Wagmi handle writeContractAsync directly
  };

  const formatShortAddress = (addr: string | null): string => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return {
    mode,
    address,
    displayLabel,
    displaySubLabel,
    shortAddress: formatShortAddress(address),
    isDemoMode,
    isConnected,
    chainId: wagmiAccount.chainId || 31337,
    connectBrowserWallet,
    disconnectWallet,
    getWalletClient,
  };
}
