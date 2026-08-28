// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MockERC20.sol";

contract DCAHook {
    address public dcaManager;
    address public owner;

    event DCAExecuted(uint256 indexed strategyId, uint256 amountExecuted, uint256 targetReceived);
    event PartialDCAExecuted(uint256 indexed strategyId, uint256 amountExecuted, uint256 targetReceived);
    event DCADelayed(uint256 indexed strategyId, uint256 delayCount);
    event ForcedDCAExecuted(uint256 indexed strategyId, uint256 amountExecuted, uint256 targetReceived);

    modifier onlyDCAManager() {
        require(msg.sender == dcaManager, "DCAHook: caller is not DCAManager");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    function setDCAManager(address _dcaManager) external {
        require(dcaManager == address(0) || msg.sender == owner, "DCAHook: unauthorized");
        dcaManager = _dcaManager;
    }

    function executeSwapHook(
        uint256 strategyId,
        address assetIn,
        address assetOut,
        uint256 amountIn,
        uint8 decisionType
    ) external virtual onlyDCAManager returns (uint256 amountOut) {
        require(amountIn > 0, "DCAHook: zero input amount");

        MockERC20 tokenIn = MockERC20(assetIn);
        require(tokenIn.transferFrom(msg.sender, address(this), amountIn), "DCAHook: assetIn transfer failed");

        amountOut = (amountIn * 1e18) / 94250e6;
        if (amountOut == 0) amountOut = amountIn / 2;

        if (assetOut != address(0) && assetOut.code.length > 0) {
            MockERC20(assetOut).mint(msg.sender, amountOut);
        }

        if (decisionType == 0) {
            emit DCAExecuted(strategyId, amountIn, amountOut);
        } else if (decisionType == 1) {
            emit PartialDCAExecuted(strategyId, amountIn, amountOut);
        } else if (decisionType == 2) {
            emit DCADelayed(strategyId, 1);
        } else if (decisionType == 3) {
            emit ForcedDCAExecuted(strategyId, amountIn, amountOut);
        }

        return amountOut;
    }
}
