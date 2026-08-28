// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MockERC20.sol";
import "./VaultAdapter.sol";

contract DCAManager {
    struct Strategy {
        address owner;
        address asset;
        address targetAsset;
        uint256 amount;
        uint256 frequency;
        uint256 maxDelay;
        uint256 maxSlippage;
        uint256 delayCount;
        uint256 lastExecuted;
        uint256 nextDca;
        uint256 totalInvested;
        uint256 totalExecuted;
        uint256 intendedAllocation;
        uint256 actualAllocation;
        bool active;
    }

    uint256 public nextStrategyId = 1;
    address public executionContract;
    address public vaultAdapter;
    address public owner;

    mapping(uint256 => Strategy) public strategies;
    mapping(address => uint256[]) public ownerStrategies;

    event StrategyCreated(
        uint256 indexed strategyId,
        address indexed owner,
        address asset,
        address targetAsset,
        uint256 amount,
        uint256 frequency,
        uint256 maxDelay,
        uint256 maxSlippage
    );

    event StrategyExecuted(uint256 indexed strategyId, uint256 amountExecuted, bool wasForced);
    event StrategyDelayed(uint256 indexed strategyId, uint256 delayCount);
    event StrategyForced(uint256 indexed strategyId, uint256 amountExecuted);

    modifier onlyOwner() {
        require(msg.sender == owner, "DCAManager: caller is not owner");
        _;
    }

    modifier onlyExecutionContract() {
        require(msg.sender == executionContract, "DCAManager: caller is not ExecutionContract");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setExecutionContract(address _executionContract) external onlyOwner {
        executionContract = _executionContract;
    }

    function setVaultAdapter(address _vaultAdapter) external onlyOwner {
        vaultAdapter = _vaultAdapter;
    }

    function createStrategy(
        address asset,
        address targetAsset,
        uint256 amount,
        uint256 frequency,
        uint256 maxDelay,
        uint256 maxSlippage
    ) external returns (uint256 strategyId) {
        require(asset != address(0), "DCAManager: invalid asset");
        require(amount > 0, "DCAManager: amount must be > 0");
        require(frequency >= 1, "DCAManager: invalid frequency");
        require(maxDelay >= 1 && maxDelay <= 20, "DCAManager: invalid maxDelay");
        require(maxSlippage > 0 && maxSlippage <= 1000, "DCAManager: invalid maxSlippage");

        strategyId = nextStrategyId++;

        // Transfer deposit from caller to VaultAdapter via ERC-20
        MockERC20 token = MockERC20(asset);
        require(token.transferFrom(msg.sender, address(this), amount), "DCAManager: deposit transfer failed");

        token.approve(vaultAdapter, amount);
        VaultAdapter(vaultAdapter).depositForStrategy(strategyId, amount);

        Strategy memory s = Strategy({
            owner: msg.sender,
            asset: asset,
            targetAsset: targetAsset,
            amount: amount,
            frequency: frequency,
            maxDelay: maxDelay,
            maxSlippage: maxSlippage,
            delayCount: 0,
            lastExecuted: 0,
            nextDca: block.timestamp,
            totalInvested: amount,
            totalExecuted: 0,
            intendedAllocation: amount,
            actualAllocation: 0,
            active: true
        });

        strategies[strategyId] = s;
        ownerStrategies[msg.sender].push(strategyId);

        emit StrategyCreated(strategyId, msg.sender, asset, targetAsset, amount, frequency, maxDelay, maxSlippage);
    }

    function isDue(uint256 strategyId) public view returns (bool) {
        Strategy memory s = strategies[strategyId];
        if (!s.active) return false;
        if (s.lastExecuted == 0) return block.timestamp >= s.nextDca;
        return block.timestamp >= s.lastExecuted + s.frequency;
    }

    function isForced(uint256 strategyId) public view returns (bool) {
        Strategy memory s = strategies[strategyId];
        if (!s.active) return false;
        return s.delayCount >= s.maxDelay;
    }

    function recordExecution(uint256 strategyId, uint256 amountExecuted, bool wasForced) external onlyExecutionContract {
        Strategy storage s = strategies[strategyId];
        require(s.active, "DCAManager: strategy not active");

        s.lastExecuted = block.timestamp;
        s.nextDca = block.timestamp + s.frequency;
        s.totalExecuted += amountExecuted;
        s.actualAllocation += amountExecuted;
        s.delayCount = 0; // Reset consecutive delay counter

        if (wasForced) {
            emit StrategyForced(strategyId, amountExecuted);
        } else {
            emit StrategyExecuted(strategyId, amountExecuted, false);
        }

        uint256 remainingBal = VaultAdapter(vaultAdapter).getVaultBalance(strategyId);
        if (remainingBal == 0) {
            s.active = false;
        }
    }

    function recordDelay(uint256 strategyId) external onlyExecutionContract {
        Strategy storage s = strategies[strategyId];
        require(s.active, "DCAManager: strategy not active");

        s.delayCount += 1;
        s.nextDca = block.timestamp + s.frequency;

        emit StrategyDelayed(strategyId, s.delayCount);
    }

    function getStrategy(uint256 strategyId) external view returns (Strategy memory) {
        return strategies[strategyId];
    }
}
