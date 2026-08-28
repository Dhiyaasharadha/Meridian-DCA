// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MockERC20.sol";
import "../src/YieldVault.sol";
import "../src/VaultAdapter.sol";
import "../src/DCAHook.sol";
import "../src/DCAManager.sol";
import "../src/ExecutionContract.sol";

// Mock failing hook to test atomicity
contract RevertingDCAHook is DCAHook {
    constructor(address owner) DCAHook(owner) {}

    function executeSwapHook(
        uint256,
        address,
        address,
        uint256,
        uint8
    ) external pure override returns (uint256) {
        revert("Uniswap v4 Swap Failed: Insufficient Liquidity");
    }
}

contract ExecutionContractTest is Test {
    MockERC20 public usdc;
    MockERC20 public btc;
    YieldVault public vault;
    VaultAdapter public adapter;
    RevertingDCAHook public revertingHook;
    DCAManager public manager;
    ExecutionContract public execution;

    address public user = address(0xABC);

    function setUp() public {
        usdc = new MockERC20("USD Coin", "USDC", 6);
        btc = new MockERC20("Bitcoin", "BTC", 8);

        vault = new YieldVault(address(usdc), "Yield USDC Vault", "yUSDC");
        revertingHook = new RevertingDCAHook(address(this));

        manager = new DCAManager();
        adapter = new VaultAdapter(address(vault), address(manager));

        execution = new ExecutionContract(address(manager), address(adapter), address(revertingHook));

        manager.setVaultAdapter(address(adapter));
        manager.setExecutionContract(address(execution));
        adapter.setExecutionContract(address(execution));
        revertingHook.setDCAManager(address(execution));

        usdc.mint(user, 5000e6);
    }

    function testAtomicityOnSwapFailure() public {
        vm.startPrank(user);
        usdc.approve(address(manager), 1000e6);

        // 1. Create strategy with $1000 deposit
        uint256 strategyId = manager.createStrategy(
            address(usdc),
            address(btc),
            1000e6,
            7 days,
            5,
            50
        );

        assertEq(adapter.getVaultBalance(strategyId), 1000e6);
        vm.stopPrank();

        // 2. Attempt execution for $400 tranche with reverting swap hook
        vm.expectRevert(bytes("Uniswap v4 Swap Failed: Insufficient Liquidity"));
        execution.execute(strategyId, 100);

        // 3. Assert ATOMICITY: Vault balance remains untouched ($1000) and strategy totalExecuted remains 0!
        assertEq(adapter.getVaultBalance(strategyId), 1000e6);

        DCAManager.Strategy memory s = manager.getStrategy(strategyId);
        assertEq(s.totalExecuted, 0);
    }
}
