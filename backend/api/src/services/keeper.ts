import { evaluateStrategy } from './decisionOrchestrator';

let keeperTimer: NodeJS.Timeout | null = null;
const KEEPER_INTERVAL_MS = Number(process.env.KEEPER_INTERVAL_MS || 10000);

export function startKeeper() {
  if (keeperTimer) return;
  console.log(`[YieldGuard Keeper] Starting automated strategy keeper loop (polling every ${KEEPER_INTERVAL_MS}ms)...`);

  keeperTimer = setInterval(async () => {
    try {
      // In hackathon demo mode, poll strategy #1
      const strategyId = '1';
      console.log(`[YieldGuard Keeper] Polling active strategy #${strategyId}...`);
      await evaluateStrategy(strategyId, true);
    } catch (err: any) {
      console.error('[YieldGuard Keeper] Error in polling loop:', err?.message || err);
    }
  }, KEEPER_INTERVAL_MS);
}

export function stopKeeper() {
  if (keeperTimer) {
    clearInterval(keeperTimer);
    keeperTimer = null;
    console.log('[YieldGuard Keeper] Keeper loop stopped.');
  }
}
