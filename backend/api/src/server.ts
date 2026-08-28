import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';
import { CONFIG } from './config/env';
import { startKeeper } from './services/keeper';

const app = express();

const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (
      origin === frontendOrigin ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use('/', apiRoutes);

app.listen(CONFIG.PORT, CONFIG.HOST, () => {
  console.log(`==================================================`);
  console.log(` YieldGuard AI Integration & Orchestration Engine `);
  console.log(`==================================================`);
  console.log(` Server running on http://${CONFIG.HOST}:${CONFIG.PORT}`);
  console.log(` Health check:    http://${CONFIG.HOST}:${CONFIG.PORT}/health`);
  console.log(` Network:         Chain ID ${CONFIG.CHAIN_ID}`);
  console.log(` CORS Allowed:    ${frontendOrigin}`);
  console.log(`==================================================`);

  // Start automated strategy keeper loop
  startKeeper();
});
