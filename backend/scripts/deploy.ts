import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function main() {
  console.log('Deploying Meridian-DCA contracts to local Anvil node...');

  const foundryBin = process.env.FOUNDRY_BIN || 'forge';
  const deployCmd = `${foundryBin} script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast`;

  try {
    const output = execSync(deployCmd, { cwd: path.join(__dirname, '..'), encoding: 'utf-8' });
    console.log(output);

    // Extract address logs from forge script output
    const extractAddress = (label: string): string => {
      const match = output.match(new RegExp(`${label}:\\s*(0x[a-fA-F0-9]{40})`));
      return match ? match[1] : '';
    };

    const deployments = {
      chainId: 31337,
      DCAManager: extractAddress('DCAManager') || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      ExecutionContract: extractAddress('ExecutionContract') || '0x9A676e781A523b5d0C0e43731313A708CB607508',
      VaultAdapter: extractAddress('VaultAdapter') || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      YieldVault: extractAddress('YieldVault') || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      DCAHook: extractAddress('DCAHook') || '0xCf7Ed3AccA5a467e9e75457215744945220f6844',
      MockMarketOracle: extractAddress('MockMarketOracle') || '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      MockUSDC: extractAddress('MockUSDC') || '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      MockETH: extractAddress('MockETH') || '0x0165878A594ca255338adfa4d48449f69242Eb8F',
      MockBTC: extractAddress('MockBTC') || '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
      MockSOL: extractAddress('MockSOL') || '0x2E234DAe75C793f67A35089C9d99245E1C58470b',
    };

    const deployDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deployDir)) fs.mkdirSync(deployDir, { recursive: true });

    const jsonPath = path.join(deployDir, 'localhost.json');
    fs.writeFileSync(jsonPath, JSON.stringify(deployments, null, 2));

    console.log(`Saved deployment addresses to: ${jsonPath}`);
    console.log(JSON.stringify(deployments, null, 2));
  } catch (err: any) {
    console.error('Deployment error:', err?.message || err);
  }
}

main();
