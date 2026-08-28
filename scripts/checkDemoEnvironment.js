/**
 * Meridian DCA - Demo Environment Health Check Script
 * Verifies local Anvil node, deployed smart contracts, Express REST API, and Next.js frontend.
 */

const fs = require('fs');
const path = require('path');

async function checkEnvironment() {
  console.log('\n==================================================');
  console.log(' MERIDIAN DCA — DEMO ENVIRONMENT HEALTH CHECK');
  console.log('==================================================\n');

  let errors = 0;

  // 1. Check Anvil RPC Connection
  console.log('[1/4] Checking Anvil Local Node (http://127.0.0.1:8545)...');
  try {
    const rpcRes = await fetch('http://127.0.0.1:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
    }).then((r) => r.json());

    if (rpcRes && rpcRes.result) {
      const blockNum = parseInt(rpcRes.result, 16);
      console.log(`  ✓ Anvil RPC connected cleanly! Block #${blockNum}`);
    } else {
      console.error('  ❌ Anvil RPC returned invalid response.');
      errors++;
    }
  } catch (err) {
    console.error('  ❌ Anvil RPC is NOT running on http://127.0.0.1:8545');
    console.error('     Run `anvil` in Terminal 1.');
    errors++;
  }

  // 2. Check Contract Deployment & Bytecode
  console.log('\n[2/4] Verifying Smart Contract Bytecode on Anvil...');
  const deploymentsPath = path.join(__dirname, '../backend/deployments/localhost.json');
  if (fs.existsSync(deploymentsPath)) {
    const deployment = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));
    const contractsToCheck = ['DCAManager', 'VaultAdapter', 'YieldVault', 'ExecutionContract', 'DCAHook', 'MockMarketOracle'];

    for (const contractName of contractsToCheck) {
      const address = deployment[contractName];
      if (!address) {
        console.error(`  ❌ Missing address for ${contractName} in localhost.json`);
        errors++;
        continue;
      }

      try {
        const codeRes = await fetch('http://127.0.0.1:8545', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getCode', params: [address, 'latest'], id: 1 }),
        }).then((r) => r.json());

        if (codeRes && codeRes.result && codeRes.result !== '0x' && codeRes.result.length > 10) {
          console.log(`  ✓ ${contractName} (${address.slice(0, 6)}...${address.slice(-4)}) bytecode verified.`);
        } else {
          console.error(`  ❌ ${contractName} (${address}) has no bytecode on Anvil! Re-run \`npm run deploy:local\` in backend.`);
          errors++;
        }
      } catch (err) {
        console.error(`  ❌ Failed to query bytecode for ${contractName}:`, err.message);
        errors++;
      }
    }
  } else {
    console.error('  ❌ backend/deployments/localhost.json does not exist. Run `npm run deploy:local` in backend.');
    errors++;
  }

  // 3. Check Backend REST API Server
  console.log('\n[3/4] Checking Backend REST API (http://localhost:4000/health)...');
  try {
    const healthRes = await fetch('http://localhost:4000/health').then((r) => r.json());
    if (healthRes && healthRes.status === 'ok') {
      console.log(`  ✓ Backend REST API connected! Status: ${healthRes.status}, Network: ${healthRes.network}`);
    } else {
      console.error('  ❌ Backend API returned non-ok health status.');
      errors++;
    }
  } catch (err) {
    console.error('  ❌ Backend API is NOT running on http://localhost:4000');
    console.error('     Run `cd backend && npm run dev:api` in Terminal 2.');
    errors++;
  }

  // 4. Check Frontend Web App
  console.log('\n[4/4] Checking Frontend Server (http://localhost:3000)...');
  try {
    const frontRes = await fetch('http://localhost:3000');
    if (frontRes.status === 200) {
      console.log(`  ✓ Frontend Web App is live! Status code: ${frontRes.status} (OK)`);
    } else {
      console.warn(`  ⚠️ Frontend server returned status code: ${frontRes.status}`);
    }
  } catch (err) {
    console.error('  ❌ Frontend App is NOT running on http://localhost:3000');
    console.error('     Run `cd frontend && npm run dev` in Terminal 3.');
    errors++;
  }

  console.log('\n==================================================');
  if (errors === 0) {
    console.log(' 🎉 ALL DEMO ENVIRONMENT HEALTH CHECKS PASSED!');
    console.log('     Open http://localhost:3000 to start your live demo.');
  } else {
    console.log(` ⚠️ HEALTH CHECK COMPLETED WITH ${errors} ISSUES.`);
    console.log('     Please resolve the errors above before live demo.');
  }
  console.log('==================================================\n');
}

checkEnvironment();
