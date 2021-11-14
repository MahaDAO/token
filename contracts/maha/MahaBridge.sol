// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface IMahaDAOToken {
    function deposit(address user, uint256 amount) external;
}

contract MahaBridge is Pausable, Ownable {
    address public _depositAdmin;
    address private _bscMahaDAOToken;

    event Bridged(
        bytes indexed txHash,
        address indexed account,
        uint256 amount
    );

    constructor(address bscMahaDAOToken_) {
        _bscMahaDAOToken = bscMahaDAOToken_;
    }

    modifier onlyDepositAdmin() {
        require(_msgSender() == _depositAdmin, "caller != depositAdmin");
        _;
    }

    function deposit(address _account, uint256 _amount)
        external
        whenNotPaused
        onlyDepositAdmin
    {
        IMahaDAOToken(_bscMahaDAOToken).deposit(_account, _amount);
    }

    function setDepositAdmin(address _newAdmin) external onlyOwner {
        _depositAdmin = _newAdmin;
    }

    // IMPLEMENT PAUSABLE FUNCTIONS
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
