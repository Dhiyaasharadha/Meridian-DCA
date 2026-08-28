import { useState, useEffect } from 'react';
import { useStrategyStore, StrategyData } from '@/store/strategyStore';
import { fetchDemoState, DemoStateResponse } from '@/lib/api';

export function useStrategy(strategyId?: string) {
  const { getActiveStrategy, activeStrategyId } = useStrategyStore();
  const activeStrategy = getActiveStrategy();
  const targetId = strategyId || activeStrategyId || '1';

  const [demoState, setDemoState] = useState<DemoStateResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDemoState = async () => {
    try {
      const state = await fetchDemoState(targetId);
      if (state) {
        setDemoState(state);
      }
    } catch (err) {
      console.warn('Error loading demo state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDemoState();
    const timer = setInterval(loadDemoState, 5000); // 5s target polling
    return () => clearInterval(timer);
  }, [targetId]);

  const contractStrategy: StrategyData = {
    strategyId: targetId,
    asset: (demoState?.strategy.targetAsset as any) || activeStrategy?.asset || 'BTC',
    amount: demoState?.strategy.amount || activeStrategy?.amount || 2500,
    frequency: activeStrategy?.frequency || 'Weekly',
    frequencySeconds: activeStrategy?.frequencySeconds || 604800,
    maxDelay: demoState?.strategy.maxDelay || activeStrategy?.maxDelay || 5,
    maxSlippage: activeStrategy?.maxSlippage || 0.5,
    createdAt: activeStrategy?.createdAt || Date.now() - 86400000 * 3,
    delayCount: demoState?.strategy.delayCount ?? activeStrategy?.delayCount ?? 2,
    status: (demoState?.strategy.status as any) || 'ACTIVE',
  };

  return {
    strategy: contractStrategy,
    demoState,
    isLoading,
    isContractConnected: true,
    refetch: loadDemoState,
  };
}
