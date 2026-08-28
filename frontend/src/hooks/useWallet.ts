import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { useState, useEffect } from 'react';

export type WalletStateMode = 
  | 'CONNECTED'
  | 'CONNECTING'
  | 'DISCONNECTED'
  | 'WRONG_NETWORK'
  | 'NO_INJECTED_WALLET'
  | 'ERROR';

export interface WalletState {
  mode: WalletStateMode;
  address: `0x${string}` | null;
  displayLabel: string;
  shortAddress: string;
  isConnected: boolean;
  isConnecting: boolean;
  isWrongNetwork: boolean;
  targetChainId: number;
  chainId: number | undefined;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchOrAddNetwork: () => Promise<void>;
}

export function useWallet(): WalletState {
  const wagmiAccount = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [hasInjected, setHasInjected] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasInjected(!!(window as any).ethereum);
    }
  }, []);

  const targetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 31337);
  const targetChainHex = `0x${targetChainId.toString(16)}`;
  const targetChainName = targetChainId === 11155111 ? 'Ethereum Sepolia' : 'Anvil Localhost';

  const isConnected = wagmiAccount.isConnected && !!wagmiAccount.address;
  const isConnecting = wagmiAccount.isConnecting;
  const activeChainId = wagmiAccount.chainId || chainId;
  const isWrongNetwork = isConnected && activeChainId !== targetChainId;

  let mode: WalletStateMode = 'DISCONNECTED';
  let displayLabel = 'Connect Wallet';

  if (!hasInjected) {
    mode = 'NO_INJECTED_WALLET';
    displayLabel = 'Install MetaMask';
  } else if (isConnecting) {
    mode = 'CONNECTING';
    displayLabel = 'Connecting Wallet...';
  } else if (isWrongNetwork) {
    mode = 'WRONG_NETWORK';
    displayLabel = `Switch to ${targetChainName}`;
  } else if (isConnected) {
    mode = 'CONNECTED';
    displayLabel = 'Wallet Connected';
  } else {
    mode = 'DISCONNECTED';
    displayLabel = 'Connect Wallet';
  }

  const formatShortAddress = (addr: string | null): string => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const connectWallet = async () => {
    if (!hasInjected) {
      if (typeof window !== 'undefined') {
        window.open('https://metamask.io/download/', '_blank');
      }
      return;
    }

    try {
      const injectedConnector = connectors.find((c) => c.id === 'injected') || connectors[0];
      if (injectedConnector) {
        connect({ connector: injectedConnector });
      }
    } catch (err) {
      console.error('MetaMask connection failed:', err);
    }
  };

  const disconnectWallet = () => {
    if (wagmiAccount.isConnected) {
      disconnect();
    }
  };

  const switchOrAddNetwork = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) return;

    try {
      if (switchChain) {
        switchChain({ chainId: targetChainId });
      } else {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainHex }],
        });
      }
    } catch (switchError: any) {
      if (switchError?.code === 4902 || switchError?.message?.includes('Unrecognized chain')) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: targetChainHex,
                chainName: targetChainName,
                rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'],
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error(`Failed to add ${targetChainName} to MetaMask:`, addError);
        }
      } else {
        console.error('Failed to switch network in MetaMask:', switchError);
      }
    }
  };

  return {
    mode,
    address: (wagmiAccount.address as `0x${string}`) || null,
    displayLabel,
    shortAddress: formatShortAddress(wagmiAccount.address || null),
    isConnected,
    isConnecting,
    isWrongNetwork,
    targetChainId,
    chainId: activeChainId,
    connectWallet,
    disconnectWallet,
    switchOrAddNetwork,
  };
}
