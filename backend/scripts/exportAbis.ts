import fs from 'fs';
import path from 'path';

function exportAbi(contractFile: string, contractName: string) {
  const outPath = path.join(__dirname, '..', 'out', contractFile, `${contractName}.json`);
  if (!fs.existsSync(outPath)) {
    console.warn(`Artifact not found at ${outPath}`);
    return;
  }
  const artifact = JSON.parse(fs.readFileSync(outPath, 'utf-8'));
  const abi = artifact.abi;

  const abiDir = path.join(__dirname, '..', 'abi');
  if (!fs.existsSync(abiDir)) fs.mkdirSync(abiDir, { recursive: true });

  const destPath = path.join(abiDir, `${contractName}.json`);
  fs.writeFileSync(destPath, JSON.stringify(abi, null, 2));
  console.log(`Exported ABI for ${contractName} -> ${destPath}`);
}

async function main() {
  exportAbi('DCAManager.sol', 'DCAManager');
  exportAbi('ExecutionContract.sol', 'ExecutionContract');
  exportAbi('VaultAdapter.sol', 'VaultAdapter');
  exportAbi('YieldVault.sol', 'YieldVault');
  exportAbi('DCAHook.sol', 'DCAHook');
  exportAbi('MockMarketOracle.sol', 'MockMarketOracle');
}

main();
