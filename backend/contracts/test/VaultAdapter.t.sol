// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MockERC20.sol";
import "../src/YieldVault.sol";
import "../src/VaultAdapter.sol";

contract VaultAdapterTest is Test {
    MockERC20 public usdc;
    YieldVault public vault;
    VaultAdapter public adapter;
    address public manager = address(0x999);

    function setUp() public {
        usdc = new MockERC20("USD Coin", "USDC", 6);
        vault = new YieldVault(address(usdc), "Yield USDC Vault", "yUSDC");
        adapter = new VaultAdapter(address(vault), manager);

        usdc.mint(manager, 10000e6);
    }

    function testPartialTrancheWithdrawal() public {
        vm.startPrank(manager);
        usdc.approve(address(adapter), 1000e6);

        // 1. Deposit $1000 into vault for Strategy #1
        adapter.depositForStrategy(1, 1000e6);
        assertEq(adapter.getVaultBalance(1), 1000e6);

        // 2. Execution requests exact $400 tranche withdrawal
        adapter.withdrawForStrategy(1, 400e6);

        // 3. Assert ONLY $400 was withdrawn, and $600 remains invested in vault!
        uint256 remainingBal = adapter.getVaultBalance(1);
        assertEq(remainingBal, 600e6);
        assertEq(usdc.balanceOf(manager), 9400e6); // 9000 initial remaining + 400 withdrawn

        vm.stopPrank();
    }
}
