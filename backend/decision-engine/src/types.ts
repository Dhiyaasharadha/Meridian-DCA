export type DecisionType = 'EXECUTE' | 'PARTIAL' | 'DELAY' | 'FORCED';
export type ApiDecisionType = 'execute' | 'partial' | 'delay' | 'forced';

export interface DecisionInputs {
  priceDeviation: number;     // Percentage e.g. 0.15 (+0.15% vs TWAP)
  volatility: number;         // 1 = Low, 2 = Medium, 3 = High
  liquidity: number;          // 1 = Low, 2 = Medium, 3 = High
  slippage: number;           // In percentage e.g. 0.18 (%)
  priceImpact: number;        // In percentage e.g. 0.04 (%)
  executionUrgency: number;   // 1 = Low, 2 = Normal, 3 = High
  yieldOpportunity: number;   // APY percentage e.g. 5.4 (%)
  delayCount: number;         // Current delay count
  maxDelay: number;           // Max allowed delay cycles
  intendedAllocation?: number;// Intended schedule total capital to date
  actualAllocation?: number;  // Actual executed capital to date
  missedExecutions?: number;  // Missed execution count
}

export interface FactorContribution {
  factor: string;
  label: string;
  contribution: number;
}

export interface FidelityResult {
  fidelity: number;
  delayPenalty: number;
  allocationDrift: number;
  missedExecutionPenalty: number;
  forced: boolean;
}

export interface EconomicResult {
  benefit: number;
  cost: number;
  yieldBenefit: number;
  executionQualityBenefit: number;
  gasCost: number;
  slippageCost: number;
  delayJustified: boolean;
}

export interface NormalizedMarket {
  liquidityNorm: number;
  slippageNorm: number;
  volatilityNorm: number;
  yieldNorm: number;
  urgencyNorm: number;
}

export interface MarketState {
  currentPrice: number;
  twapPrice: number;
  priceDeviation: number;
  volatility: 'Low' | 'Medium' | 'High';
  liquidityDepth: 'Low' | 'Medium' | 'High';
  slippage: number;
  executionUrgency: 'Low' | 'Normal' | 'High';
}

export interface DecisionOutput {
  strategyId: string | number;
  decision: ApiDecisionType;
  apiDecision: ApiDecisionType;
  score: number;
  executionPercentage: number;
  recommendedTranchePercentage: number;
  recommendedTrancheAmount: number;
  fidelity: number;
  delayCount: number;
  maxDelay: number;
  reasons: FactorContribution[];
  factorContributions: FactorContribution[];
  economicViability: EconomicResult;
  fidelityDetails: FidelityResult;
  forced: boolean;
  timestamp: number | string;
  txHash?: string;
}
