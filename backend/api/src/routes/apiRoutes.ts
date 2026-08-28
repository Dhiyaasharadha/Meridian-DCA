import { Router } from 'express';
import {
  getHealth,
  getStrategy,
  getOwnerStrategies,
  getMarket,
  getScore,
  getFidelity,
  getEconomic,
  getLog,
  getMetrics,
  getDemoState,
  postEvaluate,
  getAuditTrail,
} from '../controllers/strategyController';
import { postMarketCondition, postForceExecution, postReset } from '../controllers/demoController';

const router = Router();

router.get('/health', getHealth);
router.get('/strategy/:strategyId', getStrategy);
router.get('/strategies/:owner', getOwnerStrategies);
router.get('/market/:strategyId', getMarket);
router.get('/score/:strategyId', getScore);
router.get('/fidelity/:strategyId', getFidelity);
router.get('/economic/:strategyId', getEconomic);
router.get('/log/:strategyId', getLog);
router.get('/metrics/:strategyId', getMetrics);
router.get('/demo/state/:strategyId', getDemoState);
router.get('/audit', getAuditTrail);

router.post('/evaluate/:strategyId', postEvaluate);
router.post('/demo/market-condition', postMarketCondition);
router.post('/demo/force-execution', postForceExecution);
router.post('/demo/reset', postReset);

export default router;
