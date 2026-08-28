import { Request, Response } from 'express';
import { setMarketScenario } from '../services/marketService';
import { evaluateStrategy } from '../services/decisionOrchestrator';
import { clearDecisionLogs } from '../services/strategyService';

export const postMarketCondition = async (req: Request, res: Response) => {
  const { scenario, strategyId = '1', customInputs } = req.body;

  const validScenarios = ['good', 'moderate', 'bad', 'forced', 'economic_veto', 'fidelity_low'];
  if (!validScenarios.includes(scenario)) {
    return res.status(400).json({
      error: true,
      code: 'INVALID_SCENARIO',
      message: 'Invalid scenario. Must be one of: good, moderate, bad, forced, economic_veto, fidelity_low',
    });
  }

  setMarketScenario(scenario as any, customInputs);

  const decisionJSON = await evaluateStrategy(strategyId, true);

  res.json({
    success: true,
    scenario,
    decision: decisionJSON.decision,
    score: decisionJSON.score,
    log: decisionJSON,
  });
};

export const postForceExecution = async (req: Request, res: Response) => {
  const { strategyId = '1' } = req.body;

  setMarketScenario('forced');
  const decisionJSON = await evaluateStrategy(strategyId, true);

  res.json({
    success: true,
    message: 'Forced catch-up execution triggered successfully',
    decision: 'forced',
    log: decisionJSON,
  });
};

export const postReset = async (req: Request, res: Response) => {
  const { strategyId = '1' } = req.body;

  setMarketScenario('good');
  clearDecisionLogs(String(strategyId));

  res.json({
    success: true,
    message: 'Demo state reset to initial GOOD MARKET conditions',
  });
};
