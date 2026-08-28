import { Request, Response } from 'express';
import { checkNetworkConnection, deployments } from '../services/blockchainService';
import { getMarketTelemetry, getActiveScenario } from '../services/marketService';
import { evaluateStrategy, getAuditRecords } from '../services/decisionOrchestrator';
import { calculateMarketScore } from '../../../decision-engine/src/marketScore';
import { calculateDCAFidelity } from '../../../decision-engine/src/fidelityEngine';
import { calculateEconomicViability } from '../../../decision-engine/src/economicEngine';
import { getDecisionLogs } from '../services/strategyService';

import { CONFIG } from '../config/env';

export const getHealth = async (req: Request, res: Response) => {
  const isConnected = await checkNetworkConnection();

  res.json({
    status: 'ok',
    network: process.env.NODE_ENV === 'production' ? 'sepolia' : 'anvil',
    chainId: CONFIG.CHAIN_ID,
    api: true,
    contracts: {
      dcaManager: !!CONFIG.DCA_MANAGER_ADDRESS,
      vaultAdapter: !!CONFIG.VAULT_ADAPTER_ADDRESS,
      executionContract: !!CONFIG.EXECUTION_CONTRACT_ADDRESS,
      hook: !!CONFIG.DCA_HOOK_ADDRESS,
      oracle: !!CONFIG.MARKET_ORACLE_ADDRESS,
    },
    decisionEngine: true,
  });
};

export const getStrategy = (req: Request, res: Response) => {
  const { strategyId } = req.params;
  const demoStrategy = {
    strategyId: strategyId || '1',
    owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    asset: 'USDC',
    targetAsset: 'BTC',
    amount: 2500,
    frequency: 'Weekly',
    frequencySeconds: 604800,
    maxDelay: 5,
    maxSlippage: 0.5,
    createdAt: Date.now() - 86400000 * 3,
    nextDca: Date.now() + 86400000 * 4,
    delayCount: 2,
    totalInvested: 2500,
    totalExecuted: 1000,
    vaultBalance: 1508.42,
    yieldEarned: 8.42,
    intendedAllocation: 2500,
    actualAllocation: 1000,
    status: 'ACTIVE',
  };

  res.json(demoStrategy);
};

export const getOwnerStrategies = (req: Request, res: Response) => {
  const { owner } = req.params;
  res.json([
    {
      strategyId: '1',
      owner,
      asset: 'USDC',
      targetAsset: 'BTC',
      amount: 2500,
      status: 'ACTIVE',
    },
  ]);
};

export const getMarket = (req: Request, res: Response) => {
  const { strategyId = '1' } = req.params;
  const { data } = getMarketTelemetry(strategyId);
  res.json(data);
};

export const getScore = (req: Request, res: Response) => {
  const { strategyId = '1' } = req.params;
  const { inputs } = getMarketTelemetry(strategyId);
  const { score, normalized } = calculateMarketScore(inputs);

  res.json({
    score,
    liquidityNormalized: normalized.liquidityNorm,
    slippageNormalized: normalized.slippageNorm,
    volatilityNormalized: normalized.volatilityNorm,
    yieldNormalized: normalized.yieldNorm,
    urgencyNormalized: normalized.urgencyNorm,
    weightedContributions: {
      liquidity: Math.round(0.30 * normalized.liquidityNorm),
      slippage: Math.round(0.25 * normalized.slippageNorm),
      volatility: Math.round(0.20 * normalized.volatilityNorm),
      yield: Math.round(0.15 * normalized.yieldNorm),
      urgency: Math.round(0.10 * normalized.urgencyNorm),
    },
  });
};

export const getFidelity = (req: Request, res: Response) => {
  const { strategyId = '1' } = req.params;
  const { inputs } = getMarketTelemetry(strategyId);
  const fidelityRes = calculateDCAFidelity(inputs);

  res.json(fidelityRes);
};

export const getEconomic = (req: Request, res: Response) => {
  const { strategyId = '1' } = req.params;
  const { inputs } = getMarketTelemetry(strategyId);
  const econRes = calculateEconomicViability(inputs, 500);

  res.json(econRes);
};

export const getLog = (req: Request, res: Response) => {
  const { strategyId = '1' } = req.params;
  const logs = getDecisionLogs(String(strategyId));
  res.json(logs);
};

export const getMetrics = async (req: Request, res: Response) => {
  const { strategyId = '1' } = req.params;
  const evalRes = await evaluateStrategy(strategyId, false);

  const yieldGenerated = 8.42;
  const slippageSaved = 142.50;
  const liquidityAdvantage = 98.00;
  const executionCost = 32.40;

  const capitalEfficiency = Number(
    ((yieldGenerated + slippageSaved + liquidityAdvantage) / executionCost).toFixed(2)
  );

  res.json({
    capitalEfficiency,
    yieldGenerated,
    slippageSaved,
    liquidityAdvantage,
    executionCost,
    totalCapital: 2500,
    capitalExecuted: 1000,
    capitalRemaining: 1500,
    averageExecutionScore: evalRes.score,
    averageFidelity: evalRes.fidelity,
    averageDelay: 1.8,
    executeCount: 4,
    partialCount: 2,
    delayCount: 3,
    forcedCount: 1,
    traditionalDcaScore: 62,
    yieldGuardScore: 89,
    demoBenchmark: true,
  });
};

export const getDemoState = async (req: Request, res: Response) => {
  const { strategyId = '1' } = req.params;
  const scenario = getActiveScenario();
  const { inputs, data: marketData } = getMarketTelemetry(strategyId);

  const scoreRes = calculateMarketScore(inputs);
  const fidelityRes = calculateDCAFidelity(inputs);
  const econRes = calculateEconomicViability(inputs, 500);
  const evalRes = await evaluateStrategy(strategyId, false);

  res.json({
    strategy: {
      strategyId,
      owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      asset: 'USDC',
      targetAsset: 'BTC',
      amount: 2500,
      status: 'ACTIVE',
      delayCount: inputs.delayCount,
      maxDelay: inputs.maxDelay,
    },
    vault: {
      balance: 1508.42,
      principal: 1500.00,
      yieldEarned: 8.42,
      apy: 5.4,
    },
    market: {
      scenario,
      currentPrice: marketData.currentPrice,
      twap: marketData.twap,
      priceDeviation: marketData.priceDeviation,
      volatility: inputs.volatility === 1 ? 'Low' : inputs.volatility === 2 ? 'Medium' : 'High',
      liquidity: inputs.liquidity === 3 ? 'High' : inputs.liquidity === 2 ? 'Medium' : 'Low',
      slippage: inputs.slippage,
    },
    score: scoreRes.score,
    fidelity: fidelityRes.fidelity,
    economicViability: econRes,
    decision: evalRes.decision,
    executionPercentage: evalRes.executionPercentage,
    reasons: evalRes.reasons,
    metrics: {
      traditionalDcaScore: 62,
      yieldGuardScore: 89,
      capitalEfficiency: 7.68,
    },
  });
};

export const postEvaluate = async (req: Request, res: Response) => {
  const { strategyId = '1' } = req.params;
  const decisionJSON = await evaluateStrategy(strategyId, true);
  res.json(decisionJSON);
};

export const getAuditTrail = (req: Request, res: Response) => {
  const records = getAuditRecords();
  res.json(records);
};
