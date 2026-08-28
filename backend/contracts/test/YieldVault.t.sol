// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MockERC20.sol";
import "../src/YieldVault.sol";

contract YieldVaultTest is Test {
    MockERC20 public usdc;
    YieldVault public vault;
    address public user = address(0x123);

    function setUp() public {
        usdc = new MockERC20("USD Coin", "USDC", 6);
        vault = new YieldVault(address(usdc), "Yield USDC Vault", "yUSDC");
        usdc.mint(user, 10000e6);
    }

    function testDepositAndWithdraw() public {
        vm.startPrank(user);
        usdc.approve(address(vault), 1000e6);
        uint256 shares = vault.deposit(1000e6, user);
        assertEq(shares, 1000e6);
        assertEq(vault.shareBalanceOf(user), 1000e6);

        // Fast forward 30 days to test yield accrual
        vm.warp(block.timestamp + 30 days);

        uint256 totalBal = vault.getBalance(user);
        assertGt(totalBal, 1000e6); // Yield added

        uint256 sharesToRedeem = vault.shareBalanceOf(user);
        uint256 withdrawn = vault.redeem(sharesToRedeem, user, user);
        assertGt(withdrawn, 1000e6); // Received principal + yield!
        assertEq(vault.shareBalanceOf(user), 0);
        vm.stopPrank();
    }
}
