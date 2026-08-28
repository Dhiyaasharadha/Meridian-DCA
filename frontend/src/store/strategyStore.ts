import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StrategyData {
  strategyId: string;
  asset: 'BTC' | 'ETH' | 'SOL';
  amount: number;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | string;
  frequencySeconds: number;
  maxDelay: number;
  maxSlippage: number; // in percentage e.g. 0.5
  createdAt: number;
  ownerAddress?: string;
  delayCount?: number;
  status?: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

export type DemoScenario = 'live' | 'good_market' | 'moderate_market' | 'bad_market' | 'max_delay';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  txHash?: string;
}

interface StrategyStoreState {
  activeStrategyId: string | null;
  strategies: Record<string, StrategyData>;
  demoScenario: DemoScenario;
  toasts: ToastMessage[];
  
  // Actions
  setActiveStrategyId: (id: string) => void;
  addStrategy: (strategy: StrategyData) => void;
  setDemoScenario: (scenario: DemoScenario) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  getActiveStrategy: () => StrategyData | null;
}

export const DEFAULT_DEMO_STRATEGY: StrategyData = {
  strategyId: '0x7a8f9c1b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
  asset: 'BTC',
  amount: 2500,
  frequency: 'Weekly',
  frequencySeconds: 604800,
  maxDelay: 5,
  maxSlippage: 0.5,
  createdAt: Date.now() - 86400000 * 3,
  delayCount: 2,
  status: 'ACTIVE',
};

export const useStrategyStore = create<StrategyStoreState>()(
  persist(
    (set, get) => ({
      activeStrategyId: DEFAULT_DEMO_STRATEGY.strategyId,
      strategies: {
        [DEFAULT_DEMO_STRATEGY.strategyId]: DEFAULT_DEMO_STRATEGY,
      },
      demoScenario: 'good_market',
      toasts: [],

      setActiveStrategyId: (id: string) => {
        set({ activeStrategyId: id });
      },

      addStrategy: (strategy: StrategyData) => {
        set((state) => ({
          strategies: {
            ...state.strategies,
            [strategy.strategyId]: strategy,
          },
          activeStrategyId: strategy.strategyId,
        }));
      },

      setDemoScenario: (scenario: DemoScenario) => {
        set({ demoScenario: scenario });
      },

      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };
        set((state) => ({ toasts: [...state.toasts, newToast] }));

        // Auto remove after 5s
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, 5000);
      },

      removeToast: (id: string) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      getActiveStrategy: () => {
        const state = get();
        if (!state.activeStrategyId) return DEFAULT_DEMO_STRATEGY;
        return state.strategies[state.activeStrategyId] || DEFAULT_DEMO_STRATEGY;
      },
    }),
    {
      name: 'meridian-dca-strategy-storage',
      partialize: (state) => ({
        activeStrategyId: state.activeStrategyId,
        strategies: state.strategies,
        demoScenario: state.demoScenario,
      }),
    }
  )
);
