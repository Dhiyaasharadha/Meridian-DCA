import { evaluateDecision } from '../../../decision-engine/src/decisionEngine';
import { DecisionInputs, DecisionOutput, MarketState, FactorContribution } from '../../../decision-engine/src/types';

export interface DecisionLogEntry {
  id: string;
  strategyId: string;
  timestamp: string;
  decision: 'execute' | 'partial' | 'delay' | 'forced';
  score: number;
  executionPercentage: number;
  delayCount: number;
  reasons: FactorContribution[] | string[];
  tranche: number;
  marketState: {
    currentPrice: number;
    twapPrice: number;
    priceDeviation: number;
    volatility: 'Low' | 'Medium' | 'High';
    liquidityDepth: 'Low' | 'Medium' | 'High';
    slippage: number;
    executionUrgency: 'Low' | 'Normal' | 'High';
  };
}

let currentScenario: 'good' | 'moderate' | 'bad' | 'forced' = 'good';

export function getScenarioInputs(scenario: string, delayCount = 2, maxDelay = 5): DecisionInputs {
  switch (scenario) {
    case 'good':
      return {
        priceDeviation: 0.15,
        volatility: 1, // Low
        liquidity: 3,  // High
        slippage: 0.18,
        priceImpact: 0.04,
        executionUrgency: 1, // Low
        yieldOpportunity: 5.4,
        delayCount: Math.min(delayCount, maxDelay - 1),
        maxDelay,
      };
    case 'moderate':
      return {
        priceDeviation: 0.45,
        volatility: 2, // Medium
        liquidity: 2,  // Medium
        slippage: 0.25,
        priceImpact: 0.08,
        executionUrgency: 2, // Normal
        yieldOpportunity: 5.4,
        delayCount: Math.min(delayCount, maxDelay - 1),
        maxDelay,
      };
    case 'bad':
      return {
        priceDeviation: 1.45,
        volatility: 3, // High
        liquidity: 1,  // Low
        slippage: 0.85,
        priceImpact: 0.35,
        executionUrgency: 3, // High
        yieldOpportunity: 5.4,
        delayCount: Math.min(delayCount, maxDelay - 1),
        maxDelay,
      };
    case 'forced':
      return {
        priceDeviation: 1.45,
        volatility: 3,
        liquidity: 1,
        slippage: 0.85,
        priceImpact: 0.35,
        executionUrgency: 3,
        yieldOpportunity: 5.4,
        delayCount: maxDelay, // Reached max delay limit!
        maxDelay,
      };
    default:
      return getScenarioInputs('good', delayCount, maxDelay);
  }
}

export function getCurrentScenario() {
  return currentScenario;
}

export function setScenario(scenario: 'good' | 'moderate' | 'bad' | 'forced') {
  currentScenario = scenario;
}

const decisionLogStore: Record<string, DecisionLogEntry[]> = {};

export function addDecisionLog(strategyId: string, entry: DecisionLogEntry) {
  if (!decisionLogStore[strategyId]) {
    decisionLogStore[strategyId] = [];
  }
  decisionLogStore[strategyId].unshift(entry);
}

export function clearDecisionLogs(strategyId: string) {
  delete decisionLogStore[strategyId];
}

export function getDecisionLogs(strategyId: string): DecisionLogEntry[] {
  if (!decisionLogStore[strategyId] || decisionLogStore[strategyId].length === 0) {
    const inputs = getScenarioInputs(currentScenario);
    const evalRes = evaluateDecision(inputs);
    return [
      {
        id: 'log-' + Date.now(),
        strategyId,
        timestamp: new Date().toISOString(),
        decision: evalRes.decision,
        score: evalRes.score,
        executionPercentage: evalRes.executionPercentage,
        delayCount: inputs.delayCount,
        reasons: evalRes.reasons,
        tranche: evalRes.executionPercentage,
        marketState: {
          currentPrice: inputs.priceDeviation > 1 ? 95800 : 94250,
          twapPrice: 94110,
          priceDeviation: inputs.priceDeviation,
          volatility: inputs.volatility === 1 ? 'Low' : inputs.volatility === 2 ? 'Medium' : 'High',
          liquidityDepth: inputs.liquidity === 3 ? 'High' : inputs.liquidity === 2 ? 'Medium' : 'Low',
          slippage: inputs.slippage,
          executionUrgency: inputs.executionUrgency === 1 ? 'Low' : inputs.executionUrgency === 2 ? 'Normal' : 'High',
        },
      },
    ];
  }
  return decisionLogStore[strategyId];
}
