import { DemoScenario } from '@/store/strategyStore';

export interface DecisionRecord {
  id: string;
  strategyId: string;
  timestamp: string;
  decision: 'execute' | 'partial' | 'delay' | 'forced';
  score: number;
  reasons: any[];
  tranche: number;
  marketState: {
    currentPrice: number;
    twapPrice: number;
    priceDeviation: number;
    volatility: 'Low' | 'Moderate' | 'High' | 'Extreme' | string;
    liquidityDepth: 'High' | 'Medium' | 'Low' | string;
    slippage: number;
    executionUrgency: 'Normal' | 'Elevated' | 'Critical' | string;
  };
}

export interface DemoStateResponse {
  strategy: {
    strategyId: string;
    owner: string;
    asset: string;
    targetAsset: string;
    amount: number;
    status: string;
    delayCount: number;
    maxDelay: number;
  };
  vault: {
    balance: number;
    principal: number;
    yieldEarned: number;
    apy: number;
  };
  market: {
    scenario: string;
    currentPrice: number;
    twap: number;
    priceDeviation: number;
    volatility: string;
    liquidity: string;
    slippage: number;
  };
  score: number;
  fidelity: number;
  economicViability: {
    benefit: number;
    cost: number;
    yieldBenefit: number;
    executionQualityBenefit: number;
    gasCost: number;
    slippageCost: number;
    delayJustified: boolean;
  };
  decision: 'execute' | 'partial' | 'delay' | 'forced';
  executionPercentage: number;
  reasons: any[];
  metrics: {
    traditionalDcaScore: number;
    yieldGuardScore: number;
    capitalEfficiency: number;
  };
}

export interface MetricsResponse {
  capitalEfficiency: number;
  yieldGenerated: number;
  slippageSaved: number;
  liquidityAdvantage: number;
  executionCost: number;
  totalCapital: number;
  capitalExecuted: number;
  capitalRemaining: number;
  averageExecutionScore: number;
  averageFidelity: number;
  averageDelay: number;
  executeCount: number;
  partialCount: number;
  delayCount: number;
  forcedCount: number;
  traditionalDcaScore: number;
  yieldGuardScore: number;
  demoBenchmark: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_DECISION_API_URL || 'http://localhost:4000';

export async function fetchDecisionLog(
  strategyId: string = '1',
  demoScenario: DemoScenario = 'good_market'
): Promise<DecisionRecord[]> {
  try {
    const sId = strategyId || '1';
    const res = await fetch(`${API_BASE}/log/${sId}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((d: any, idx: number) => ({
          id: d.id || `log-${idx}`,
          strategyId: String(d.strategyId || sId),
          timestamp: d.timestamp || new Date().toISOString(),
          decision: d.decision || 'execute',
          score: d.score ?? 85,
          reasons: Array.isArray(d.reasons)
            ? d.reasons.map((r: any) => (typeof r === 'string' ? r : r.label || r.factor))
            : ['Optimal execution condition'],
          tranche: d.tranche ?? d.executionPercentage ?? 100,
          marketState: {
            currentPrice: d.marketState?.currentPrice ?? 94250,
            twapPrice: d.marketState?.twapPrice ?? 94110,
            priceDeviation: d.marketState?.priceDeviation ?? 0.15,
            volatility: d.marketState?.volatility ?? 'Low',
            liquidityDepth: d.marketState?.liquidityDepth ?? 'High',
            slippage: d.marketState?.slippage ?? 0.18,
            executionUrgency: d.marketState?.executionUrgency ?? 'Normal',
          },
        }));
      }
    }
  } catch (err) {
    console.warn('API error fetching decision log:', err);
  }

  // Dev dataset fallback
  return [
    {
      id: 'log-001',
      strategyId,
      timestamp: new Date().toISOString(),
      decision: 'execute',
      score: 82,
      reasons: [
        'Productive Vault Yield (+5.4% APY)',
        'Low Slippage (0.18% pool depth)',
        'Low Execution Pressure (2/5 delays)',
      ],
      tranche: 100,
      marketState: {
        currentPrice: 94250,
        twapPrice: 94110,
        priceDeviation: 0.15,
        volatility: 'Low',
        liquidityDepth: 'High',
        slippage: 0.18,
        executionUrgency: 'Normal',
      },
    },
  ];
}

export async function fetchDemoState(strategyId: string = '1'): Promise<DemoStateResponse | null> {
  try {
    const sId = strategyId || '1';
    const res = await fetch(`${API_BASE}/demo/state/${sId}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API error fetching demo state:', err);
  }
  return null;
}

export async function fetchMetrics(strategyId: string = '1'): Promise<MetricsResponse | null> {
  try {
    const sId = strategyId || '1';
    const res = await fetch(`${API_BASE}/metrics/${sId}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API error fetching metrics:', err);
  }
  return null;
}

export async function postEvaluate(strategyId: string = '1') {
  try {
    const sId = strategyId || '1';
    const res = await fetch(`${API_BASE}/evaluate/${sId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API error triggering evaluation:', err);
  }
  return null;
}

export async function postMarketCondition(scenario: string, strategyId: string = '1') {
  try {
    const sId = strategyId || '1';
    const res = await fetch(`${API_BASE}/demo/market-condition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario, strategyId: sId }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API error setting market condition:', err);
  }
  return null;
}

export async function postForceExecution(strategyId: string = '1') {
  try {
    const sId = strategyId || '1';
    const res = await fetch(`${API_BASE}/demo/force-execution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ strategyId: sId }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API error setting forced execution:', err);
  }
  return null;
}
