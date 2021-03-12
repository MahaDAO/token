pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";

import "./interfaces/IAccessControlLock.sol";

/**
 * @dev Timelocks minting tokens for the MahaToken.
 *
 * NOTE: `MINTER_ROLE` has to be revoked from all `MINTER_ROLE` holders.
 * Also this `Timelock` contract should have the `DEFAULT_ADMIN_ROLE`.
 */
contract Timelock is Ownable {
    using SafeMath for uint256;

    /**
     * State variables.
     */

    uint256 public unlockTimestamp;
    IAccessControlLock public token;
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    /**
     * Constructor.
     */
    constructor(IAccessControlLock token_) public {
        token = token_;
    }

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
     * Mutations.
     */
    function setAdminRole() public onlyOwner canRestorAdmin {
        token.grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}
