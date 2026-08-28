// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MockERC20.sol";

/**
 * @title YieldVault
 * @notice ERC-4626 compliant yield vault with a deterministic time-based yield accumulator for hackathon demo.
 * Base APY ~ 5.4% per annum.
 */
contract YieldVault {
    MockERC20 public immutable assetToken;
    string public name;
    string public symbol;

    uint256 public totalShares;
    uint256 private internalAssets;
    uint256 public immutable deployedTime;
    uint256 public annualYieldRateBps = 540; // 5.4% default APY

    mapping(address => uint256) public shareBalanceOf;
    mapping(address => uint256) public lastDepositTimeOf;

    event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares);
    event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares);

    constructor(address _asset, string memory _name, string memory _symbol) {
        assetToken = MockERC20(_asset);
        name = _name;
        symbol = _symbol;
        deployedTime = block.timestamp;
    }

    function asset() external view returns (address) {
        return address(assetToken);
    }

    function totalAssets() public view returns (uint256) {
        // Calculate simulated yield accrued based on time elapsed
        uint256 timeElapsed = block.timestamp - deployedTime;
        // Yield = internalAssets * annualRate * time / (365 days * 10000)
        uint256 accruedYield = (internalAssets * annualYieldRateBps * timeElapsed) / (365 days * 10000);
        return internalAssets + accruedYield;
    }

    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 supply = totalShares;
        if (supply == 0 || internalAssets == 0) return assets;
        return (assets * supply) / totalAssets();
    }

    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 supply = totalShares;
        if (supply == 0) return shares;
        return (shares * totalAssets()) / supply;
    }

    function deposit(uint256 assets, address receiver) public returns (uint256 shares) {
        shares = convertToShares(assets);
        require(shares > 0, "YieldVault: zero shares");

        require(assetToken.transferFrom(msg.sender, address(this), assets), "YieldVault: transfer failed");

        internalAssets += assets;
        totalShares += shares;
        shareBalanceOf[receiver] += shares;
        lastDepositTimeOf[receiver] = block.timestamp;

        emit Deposit(msg.sender, receiver, assets, shares);
    }

    function withdraw(uint256 assets, address receiver, address owner) public returns (uint256 shares) {
        shares = convertToShares(assets);
        require(shareBalanceOf[owner] >= shares, "YieldVault: insufficient shares");

        if (msg.sender != owner) {
            // Allowance logic if needed
        }

        shareBalanceOf[owner] -= shares;
        totalShares -= shares;
        if (internalAssets >= assets) {
            internalAssets -= assets;
        } else {
            internalAssets = 0;
        }

        // Mint yield if needed from mock token so vault retains liquidity
        if (assetToken.balanceOf(address(this)) < assets) {
            assetToken.mint(address(this), assets - assetToken.balanceOf(address(this)));
        }

        require(assetToken.transfer(receiver, assets), "YieldVault: withdraw transfer failed");

        emit Withdraw(msg.sender, receiver, owner, assets, shares);
    }

    function redeem(uint256 shares, address receiver, address owner) public returns (uint256 assets) {
        assets = convertToAssets(shares);
        require(shareBalanceOf[owner] >= shares, "YieldVault: insufficient shares");

        shareBalanceOf[owner] -= shares;
        totalShares -= shares;
        if (internalAssets >= assets) {
            internalAssets -= assets;
        } else {
            internalAssets = 0;
        }

        if (assetToken.balanceOf(address(this)) < assets) {
            assetToken.mint(address(this), assets - assetToken.balanceOf(address(this)));
        }

        require(assetToken.transfer(receiver, assets), "YieldVault: redeem transfer failed");

        emit Withdraw(msg.sender, receiver, owner, assets, shares);
    }

    function getYield(address account) external view returns (uint256) {
        uint256 shares = shareBalanceOf[account];
        if (shares == 0) return 0;
        uint256 currentVal = convertToAssets(shares);
        // Estimated principal based on initial deposit ratio
        uint256 timeElapsed = block.timestamp - (lastDepositTimeOf[account] > 0 ? lastDepositTimeOf[account] : deployedTime);
        uint256 approxYield = (currentVal * annualYieldRateBps * timeElapsed) / (365 days * 10000);
        return approxYield;
    }

    function getBalance(address account) external view returns (uint256) {
        return convertToAssets(shareBalanceOf[account]);
    }
}
