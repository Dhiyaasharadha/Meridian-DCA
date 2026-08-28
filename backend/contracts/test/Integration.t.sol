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

contract IntegrationTest is Test {
    MockERC20 public usdc;
    MockERC20 public btc;
    YieldVault public vault;
    VaultAdapter public adapter;
    MockMarketOracle public oracle;
    DCAHook public hook;
    DCAManager public manager;
    ExecutionContract public execution;

    address public user = address(0xA11CE);

    function setUp() public {
        usdc = new MockERC20("USD Coin", "USDC", 6);
        btc = new MockERC20("Bitcoin", "BTC", 8);

        vault = new YieldVault(address(usdc), "Yield USDC Vault", "yUSDC");
        hook = new DCAHook(address(this));
        manager = new DCAManager();
        adapter = new VaultAdapter(address(vault), address(manager));
        execution = new ExecutionContract(address(manager), address(adapter), address(hook));

        manager.setVaultAdapter(address(adapter));
        manager.setExecutionContract(address(execution));
        adapter.setExecutionContract(address(execution));
        hook.setDCAManager(address(execution));
        oracle = new MockMarketOracle();

        usdc.mint(user, 10000e6);
    }

    function testFullIntegrationFlow() public {
        vm.startPrank(user);

        // 1. Approve USDC to DCAManager
        usdc.approve(address(manager), 2500e6);

        // 2. Create DCA strategy ($2500 total capital deposit, target asset = BTC)
        uint256 strategyId = manager.createStrategy(
            address(usdc),
            address(btc),
            2500e6,
            7 days,
            5,
            50
        );

        assertEq(strategyId, 1);
        assertEq(adapter.getVaultBalance(strategyId), 2500e6);
        vm.stopPrank();

        // 3. Fast forward time by 7 days to trigger yield accrual
        vm.warp(block.timestamp + 7 days);
        assertGt(adapter.getYield(strategyId), 0);

        // 4. Execute Tranche 1 (100% of $500 tranche = $500 withdrawn, $2000+ stays in vault)
        execution.execute(strategyId, 100);
        assertGt(btc.balanceOf(user), 0);
        assertGt(adapter.getVaultBalance(strategyId), 1900e6);

        // 5. Execute Tranche 2 (PARTIAL 60% of $500 tranche = $300 withdrawn)
        vm.warp(block.timestamp + 7 days);
        uint256 btcBeforePartial = btc.balanceOf(user);
        execution.execute(strategyId, 60);
        assertGt(btc.balanceOf(user), btcBeforePartial);

        // 6. Execute Delay
        vm.warp(block.timestamp + 7 days);
        execution.delay(strategyId, "High market volatility detected");
        DCAManager.Strategy memory s = manager.getStrategy(strategyId);
        assertEq(s.delayCount, 1);

        // 7. Force execution when delay reaches maxDelay
        s.delayCount = 5;
        execution.execute(strategyId, 100);
        DCAManager.Strategy memory sAfter = manager.getStrategy(strategyId);
        assertEq(sAfter.delayCount, 0);

        emit log("Integration Test Passed Successfully!");
    }
}
