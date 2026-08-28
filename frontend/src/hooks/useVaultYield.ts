import { useStrategyStore } from '@/store/strategyStore';
import { useEffect, useState } from 'react';
import { fetchDemoState } from '@/lib/api';

export interface VaultYieldData {
  principal: number;
  vaultBalance: number;
  yieldEarned: number;
  yieldPercentage: number;
  apy: number;
}

export function useVaultYield(strategyId?: string) {
  const { getActiveStrategy, activeStrategyId } = useStrategyStore();
  const activeStrategy = getActiveStrategy();
  const targetId = strategyId || activeStrategyId || '1';

  const [yieldData, setYieldData] = useState<VaultYieldData>({
    principal: activeStrategy?.amount || 2500,
    vaultBalance: (activeStrategy?.amount || 2500) * 1.0033,
    yieldEarned: 8.42,
    yieldPercentage: 0.33,
    apy: 5.4,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadYield = async () => {
    try {
      const state = await fetchDemoState(targetId);
      if (state && state.vault) {
        setYieldData({
          principal: state.vault.principal || activeStrategy?.amount || 2500,
          vaultBalance: state.vault.balance,
          yieldEarned: state.vault.yieldEarned,
          yieldPercentage: (state.vault.yieldEarned / (state.vault.principal || 2500)) * 100,
          apy: state.vault.apy || 5.4,
        });
      }
    } catch (err) {
      console.warn('Error loading vault yield:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadYield();
    const timer = setInterval(loadYield, 5000);
    return () => clearInterval(timer);
  }, [targetId]);

  return {
    yieldData,
    isLoading,
    isContractConnected: true,
    refetch: loadYield,
  };
}
