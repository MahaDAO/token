// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ARTHValuecoin.sol";

contract WrappedARTH is ARTHValuecoin {
    event Deposit(address indexed dst, uint256 wad);
    event Withdrawal(address indexed src, uint256 wad);

    function deposit() public payable {
        _mint(msg.sender, msg.value);
        Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 wad) public {
        _burn(msg.sender, wad);
        payable(msg.sender).transfer(wad);
        Withdrawal(msg.sender, wad);
    }
}
