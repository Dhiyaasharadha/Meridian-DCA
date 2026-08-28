// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Vm {
    function startPrank(address account) external {}
    function stopPrank() external {}
    function warp(uint256 newTimestamp) external {}
    function expectRevert(bytes calldata revertData) external {}
}

contract Test {
    Vm public constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    event log(string);
    event log_named_uint(string key, uint256 val);

    function assertEq(uint256 a, uint256 b) internal pure {
        require(a == b, "assertEq uint failed");
    }

    function assertEq(bool a, bool b) internal pure {
        require(a == b, "assertEq bool failed");
    }

    function assertGt(uint256 a, uint256 b) internal pure {
        require(a > b, "assertGt uint failed");
    }
}
