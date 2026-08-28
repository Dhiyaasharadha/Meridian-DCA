// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./YieldVault.sol";
import "./MockERC20.sol";
import "../interfaces/IVaultAdapter.sol";

contract VaultAdapter is IVaultAdapter {
    address public owner;
    address public dcaManager;
    address public executionContract;
    YieldVault public immutable vault;
    MockERC20 public immutable asset;

    struct StrategyBalance {
        uint256 principal;
        uint256 shares;
        uint256 depositTimestamp;
    }

    mapping(uint256 => StrategyBalance) public strategyBalances;

    event CapitalDeposited(uint256 indexed strategyId, uint256 amount, uint256 shares);
    event CapitalWithdrawn(uint256 indexed strategyId, uint256 amount, uint256 sharesBurned);

    modifier onlyAuthorized() {
        require(msg.sender == dcaManager || msg.sender == executionContract, "VaultAdapter: unauthorized caller");
        _;
    }

    constructor(address _vault, address _dcaManager) {
        owner = msg.sender;
        vault = YieldVault(_vault);
        asset = MockERC20(vault.asset());
        dcaManager = _dcaManager;
    }

    function setExecutionContract(address _executionContract) external {
        require(msg.sender == owner || msg.sender == dcaManager || dcaManager == address(0), "VaultAdapter: unauthorized");
        executionContract = _executionContract;
    }

    function setDCAManager(address _dcaManager) external {
        require(msg.sender == owner || dcaManager == address(0), "VaultAdapter: unauthorized");
        dcaManager = _dcaManager;
    }

    function depositForStrategy(uint256 strategyId, uint256 amount) external override onlyAuthorized returns (uint256 shares) {
        require(amount > 0, "VaultAdapter: zero deposit amount");

        require(asset.transferFrom(msg.sender, address(this), amount), "VaultAdapter: transferFrom failed");
        asset.approve(address(vault), amount);

        shares = vault.deposit(amount, address(this));

        StrategyBalance storage sb = strategyBalances[strategyId];
        sb.principal += amount;
        sb.shares += shares;
        if (sb.depositTimestamp == 0) {
            sb.depositTimestamp = block.timestamp;
        }

        emit CapitalDeposited(strategyId, amount, shares);
    }

    function withdrawForStrategy(uint256 strategyId, uint256 amount) external override onlyAuthorized returns (uint256 sharesBurned) {
        require(amount > 0, "VaultAdapter: zero withdraw amount");
        StrategyBalance storage sb = strategyBalances[strategyId];
        require(sb.shares > 0, "VaultAdapter: no shares for strategy");

        uint256 currentBalance = vault.convertToAssets(sb.shares);
        require(currentBalance >= amount, "VaultAdapter: requested amount exceeds strategy vault balance");

        // Redeem exact requested amount from YieldVault to msg.sender (ExecutionContract / DCAManager)
        sharesBurned = vault.withdraw(amount, msg.sender, address(this));

        if (sb.shares >= sharesBurned) {
            sb.shares -= sharesBurned;
        } else {
            sb.shares = 0;
        }

        if (sb.principal >= amount) {
            sb.principal -= amount;
        } else {
            sb.principal = 0;
        }

        emit CapitalWithdrawn(strategyId, amount, sharesBurned);
    }

    function getYield(uint256 strategyId) external view override returns (uint256 yieldEarned) {
        StrategyBalance memory sb = strategyBalances[strategyId];
        if (sb.shares == 0) return 0;
        uint256 currentVal = vault.convertToAssets(sb.shares);
        if (currentVal > sb.principal) {
            return currentVal - sb.principal;
        }
        return 0;
    }

    function getVaultBalance(uint256 strategyId) external view override returns (uint256 totalBalance) {
        StrategyBalance memory sb = strategyBalances[strategyId];
        if (sb.shares == 0) return 0;
        return vault.convertToAssets(sb.shares);
    }

    function totalIdleCapital(uint256 strategyId) external view returns (uint256) {
        return this.getVaultBalance(strategyId);
    }

    function getPrincipal(uint256 strategyId) external view override returns (uint256 principal) {
        return strategyBalances[strategyId].principal;
    }
}
