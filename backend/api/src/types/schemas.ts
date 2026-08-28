export interface MarketData {
  currentPrice: number;
  twap: number;
  priceDeviation: number;
  volatility: number;
  liquidity: number;
  slippage: number;
  priceImpact: number;
  urgency: number;
}

export interface ScoreBreakdown {
  liquidity: number;
  slippage: number;
  volatility: number;
  yield: number;
  urgency: number;
}

export interface FidelityDetails {
  fidelity: number;
  delayPenalty: number;
  allocationDrift: number;
  missedExecutionPenalty: number;
  forced: boolean;
}

export interface EconomicViability {
  benefit: number;
  cost: number;
  yieldBenefit: number;
  executionQualityBenefit: number;
  gasCost: number;
  slippageCost: number;
  delayJustified: boolean;
}

export interface ReasonFactor {
  factor: string;
  label: string;
  contribution: number;
}

export interface DecisionJSON {
  strategyId: string | number;
  decision: 'execute' | 'partial' | 'delay' | 'forced';
  score: number;
  executionPercentage: number;
  recommendedTranchePercentage: number;
  recommendedTrancheAmount: number;
  fidelity: number;
  delayCount: number;
  maxDelay: number;
  forced: boolean;
  market: MarketData;
  scoreBreakdown: ScoreBreakdown;
  fidelityDetails: FidelityDetails;
  economicViability: EconomicViability;
  reasons: ReasonFactor[];
  timestamp: string;
  execution: {
    submitted: boolean;
    txHash: string | null;
  };
}

export interface AuditRecord extends DecisionJSON {
  rawInputs: any;
  normalizedInputs: any;
  preliminaryDecision: string;
  vetoApplied: boolean;
  finalDecision: string;
}

export interface AggregatedDemoState {
  strategy: {
    strategyId: string | number;
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
  economicViability: EconomicViability;
  decision: string;
  executionPercentage: number;
  reasons: ReasonFactor[];
  metrics: {
    traditionalDcaScore: number;
    yieldGuardScore: number;
    capitalEfficiency: number;
  };
}
