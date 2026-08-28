import { setScenario, addDecisionLog, getScenarioInputs } from '../api/src/services/strategyService';
import { evaluateDecision } from '../decision-engine/src/decisionEngine';

async function main() {
  console.log('Seeding demo scenario data for Meridian-DCA backend...');

  const strategyId = '0x7a8f9c1b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a';

  const scenarios: ('good' | 'moderate' | 'bad' | 'forced')[] = ['good', 'moderate', 'bad', 'forced'];

  scenarios.forEach((sc, idx) => {
    setScenario(sc);
    const inputs = getScenarioInputs(sc);
    const evalRes = evaluateDecision(inputs);

    const logEntry = {
      id: `seed-log-${idx + 1}`,
      strategyId,
      timestamp: new Date(Date.now() - (4 - idx) * 86400000).toISOString(),
      decision: evalRes.apiDecision,
      score: evalRes.score,
      executionPercentage: evalRes.executionPercentage,
      delayCount: inputs.delayCount,
      reasons: evalRes.reasons,
      tranche: evalRes.executionPercentage,
      marketState: {
        currentPrice: inputs.priceDeviation > 1 ? 95800 : 94250,
        twapPrice: 94110,
        priceDeviation: inputs.priceDeviation,
        volatility: (inputs.volatility === 1 ? 'Low' : inputs.volatility === 2 ? 'Medium' : 'High') as any,
        liquidityDepth: (inputs.liquidity === 3 ? 'High' : inputs.liquidity === 2 ? 'Medium' : 'Low') as any,
        slippage: inputs.slippage,
        executionUrgency: (inputs.executionUrgency === 1 ? 'Low' : inputs.executionUrgency === 2 ? 'Normal' : 'High') as any,
      },
    };

    addDecisionLog(strategyId, logEntry);
    console.log(`Seeded ${sc.toUpperCase()} scenario log: Score ${evalRes.score}/100 -> ${evalRes.apiDecision}`);
  });

  console.log('Demo seed completed successfully!');
}

main();
