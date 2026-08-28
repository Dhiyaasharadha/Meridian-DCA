// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./DCAManager.sol";
import "./VaultAdapter.sol";
import "./DCAHook.sol";
import "./MockERC20.sol";

contract ExecutionContract {
    DCAManager public immutable dcaManager;
    VaultAdapter public immutable vaultAdapter;
    DCAHook public immutable dcaHook;
    address public owner;

    event DecisionMade(
        uint256 indexed strategyId,
        string decision,
        uint256 score,
        uint256 executionPercentage,
        uint256 fidelity,
        uint256 delayCount,
        uint256 timestamp
    );

    event PartialDCAExecuted(uint256 indexed strategyId, uint256 amountExecuted, uint256 targetReceived);
    event ForcedDCAExecuted(uint256 indexed strategyId, uint256 amountExecuted, uint256 targetReceived);

    modifier onlyOwner() {
        require(msg.sender == owner, "ExecutionContract: caller is not owner");
        _;
    }

    constructor(address _dcaManager, address _vaultAdapter, address _dcaHook) {
        owner = msg.sender;
        dcaManager = DCAManager(_dcaManager);
        vaultAdapter = VaultAdapter(_vaultAdapter);
        dcaHook = DCAHook(_dcaHook);
    }

    function execute(uint256 strategyId, uint256 tranchePct) external returns (uint256 amountOut) {
        DCAManager.Strategy memory s = dcaManager.getStrategy(strategyId);
        require(s.owner != address(0), "ExecutionContract: invalid strategy");
        require(s.active, "ExecutionContract: strategy not active");
        require(dcaManager.isDue(strategyId), "ExecutionContract: DCA not due");

        bool forced = dcaManager.isForced(strategyId);
        uint256 finalTranchePct = forced ? 100 : tranchePct;
        require(finalTranchePct > 0 && finalTranchePct <= 100, "ExecutionContract: invalid tranchePct");

        uint256 availableBal = vaultAdapter.getVaultBalance(strategyId);
        require(availableBal > 0, "ExecutionContract: zero vault balance");

        // Tranche size calculation: default single cycle tranche = 20% of initial deposit or s.amount
        uint256 baseTranche = s.totalInvested / 5;
        if (baseTranche == 0) baseTranche = s.amount;
        uint256 targetTranche = baseTranche < availableBal ? baseTranche : availableBal;

        uint256 execAmount = (targetTranche * finalTranchePct) / 100;
        require(execAmount > 0, "ExecutionContract: zero execution amount");

        // 1. Withdraw exact required capital from VaultAdapter (remaining stays invested in ERC-4626 vault!)
        vaultAdapter.withdrawForStrategy(strategyId, execAmount);

        // 2. Approve DCAHook to execute swap
        MockERC20(s.asset).approve(address(dcaHook), execAmount);

        // 3. Call DCAHook to execute swap
        amountOut = dcaHook.executeSwapHook(
            strategyId,
            s.asset,
            s.targetAsset != address(0) ? s.targetAsset : address(0x1111111111111111111111111111111111111111),
            execAmount,
            forced ? 3 : (finalTranchePct < 100 ? 1 : 0)
        );

        // 4. Transfer target token received to strategy owner
        if (s.targetAsset != address(0) && s.targetAsset.code.length > 0) {
            MockERC20(s.targetAsset).transfer(s.owner, amountOut);
        }

        // 5. Record execution in DCAManager
        dcaManager.recordExecution(strategyId, execAmount, forced);

        if (forced) {
            emit ForcedDCAExecuted(strategyId, execAmount, amountOut);
        } else if (finalTranchePct < 100) {
            emit PartialDCAExecuted(strategyId, execAmount, amountOut);
        }

        return amountOut;
    }

    function delay(uint256 strategyId, string calldata reason) external {
        DCAManager.Strategy memory s = dcaManager.getStrategy(strategyId);
        require(s.active, "ExecutionContract: strategy not active");
        require(!dcaManager.isForced(strategyId), "ExecutionContract: cannot delay forced strategy");

        dcaManager.recordDelay(strategyId);
    }
}
