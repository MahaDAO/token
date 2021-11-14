// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./lib/ERC20.sol";
import "./lib/Ownable.sol";
import "./lib/Pausable.sol";
import "./lib/ERC20Permit.sol";

/**
 * Implementation of the token
 */
contract MahaRootToken is ERC20, Pausable, ERC20Permit, Ownable {
    bool public initialized;

    function initialize(address owner) external payable {
        require(!initialized, "already initialized");

        initializeERC20("MahaDAO", "MAHA");
        initializePausable();
        initializeOwnable(owner);
        initializeERC20Permit("MAHA");

        _mint(owner, 100000000 * 1e18); // mint 10 mil MAHA tokens
        initialized = true;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(address(to) != address(this), "dont send to token contract");
        require(!paused(), "ERC20Pausable: token transfer while paused");
    }

    function refundTokens() external onlyOwner {
        _transfer(address(this), owner(), balanceOf(address(this)));
    }

    function togglePause() external onlyOwner {
        if (!paused()) _pause();
        else _unpause();
    }
}
