pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IAccessControl.sol";

/**
 * @dev Timelocks minting tokens for the MahaToken.
 *
 * NOTE: `MINTER_ROLE` has to be revoked from all `MINTER_ROLE` holders.
 * Also this `Timelock` contract should have the `DEFAULT_ADMIN_ROLE`.
 */
contract Timelock is Ownable {
    /**
     * State variables.
     */

    IAccessControl public token;
    uint256 public unlockTimestamp;
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    /**
     * Event.
     */
    event Unlocked(uint256 time, address unlocker);

    /**
     * Modifier
     */
    modifier canRestorAdmin {
        require(
            block.timestamp >= unlockTimestamp,
            "Timelock: early minting not allowed"
        );
        _;
    }

    /**
     * Constructor.
     */
    constructor(IAccessControl token_) public {
        token = token_;
    }

    /**
     * Mutations.
     */
    function setAdminRole() public onlyOwner canRestorAdmin {
        token.grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        emit Unlocked(block.timestamp, msg.sender);
    }
}
