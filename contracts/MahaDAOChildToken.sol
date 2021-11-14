// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./lib/ERC20.sol";
import "./lib/Ownable.sol";
import "./lib/Pausable.sol";
import "./lib/ERC20Permit.sol";

/**
 * Implementation of the MahaDAO token
 */
contract MahaDAOChildToken is ERC20, Pausable, ERC20Permit, Ownable {
    bool public initialized;
    address public bridge;

    function initialize(address owner) external payable {
        require(!initialized, "already initialized");

        initializeERC20("MahaDAO", "SCLP");
        initializePausable();
        initializeOwnable(owner);
        initializeERC20Permit("MahaDAOX");
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

    function burn(uint256 _amount) external {
        _burn(_msgSender(), _amount);
    }

    function togglePause() external onlyOwner {
        if (!paused()) _pause();
        else _unpause();
    }

    function deposit(address _account, uint256 _amount) external {
        require(_msgSender() == bridge, "caller != bridge");
        _mint(_account, _amount);
    }

    function refundTokens() external onlyOwner {
        _transfer(address(this), owner(), balanceOf(address(this)));
    }

    function setBridge(address _bridge) external onlyOwner {
        bridge = _bridge;
    }
}
