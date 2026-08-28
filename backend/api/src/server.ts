import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';
import { CONFIG } from './config/env';
import { startKeeper } from './services/keeper';

const app = express();

const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: [frontendOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use(express.json());
app.use('/', apiRoutes);

app.listen(CONFIG.PORT, () => {
  console.log(`==================================================`);
  console.log(` YieldGuard AI Integration & Orchestration Engine `);
  console.log(`==================================================`);
  console.log(` Server running on http://localhost:${CONFIG.PORT}`);
  console.log(` Health check:    http://localhost:${CONFIG.PORT}/health`);
  console.log(` Demo State API:  http://localhost:${CONFIG.PORT}/demo/state/1`);
  console.log(` Evaluate API:    http://localhost:${CONFIG.PORT}/evaluate/1`);
  console.log(` Network:         Anvil Localhost (Chain ID ${CONFIG.CHAIN_ID})`);
  console.log(` CORS Allowed:    ${frontendOrigin}`);
  console.log(`==================================================`);

  // Start automated strategy keeper loop
  startKeeper();
});
