// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MockERC20.sol";
import "../src/YieldVault.sol";
import "../src/VaultAdapter.sol";
import "../src/MockMarketOracle.sol";
import "../src/DCAHook.sol";
import "../src/DCAManager.sol";
import "../src/ExecutionContract.sol";

contract DeployScript is Test {
    function run() external returns (
        address usdc,
        address eth,
        address btc,
        address sol,
        address vault,
        address adapter,
        address oracle,
        address hook,
        address manager,
        address execution
    ) {
        address deployer = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // Fallback deployer

        vm.startBroadcast();

        usdc = address(new MockERC20("USD Coin", "USDC", 6));
        eth = address(new MockERC20("Ethereum", "ETH", 18));
        btc = address(new MockERC20("Wrapped BTC", "BTC", 8));
        sol = address(new MockERC20("Solana", "SOL", 9));

        vault = address(new YieldVault(usdc, "Yield USDC Vault", "yUSDC"));
        hook = address(new DCAHook(deployer));
        manager = address(new DCAManager());
        adapter = address(new VaultAdapter(vault, manager));
        execution = address(new ExecutionContract(manager, adapter, hook));

        DCAManager(manager).setVaultAdapter(adapter);
        DCAManager(manager).setExecutionContract(execution);
        VaultAdapter(adapter).setExecutionContract(execution);
        DCAHook(hook).setDCAManager(execution);

        oracle = address(new MockMarketOracle());

        // Mint demo balances to deployer account
        MockERC20(usdc).mint(deployer, 1000000e6);
        MockERC20(eth).mint(deployer, 1000e18);
        MockERC20(btc).mint(deployer, 50e8);
        MockERC20(sol).mint(deployer, 5000e9);

        // Mint to second demo account
        address demoUser2 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        MockERC20(usdc).mint(demoUser2, 500000e6);

        vm.stopBroadcast();

        emit log_named_address("DCAManager", manager);
        emit log_named_address("ExecutionContract", execution);
        emit log_named_address("VaultAdapter", adapter);
        emit log_named_address("YieldVault", vault);
        emit log_named_address("DCAHook", hook);
        emit log_named_address("MockMarketOracle", oracle);
        emit log_named_address("MockUSDC", usdc);
        emit log_named_address("MockETH", eth);
        emit log_named_address("MockBTC", btc);
        emit log_named_address("MockSOL", sol);
    }
}
