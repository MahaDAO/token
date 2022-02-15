// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ARTHValuecoin is ERC20, ERC20Permit {
    bytes32 private immutable _COMMIT_TYPEHASH =
        keccak256(
            "Commit(address from, address to, uint256 amount, uint256 commissionAmount, uint256 deadline)"
        );

    event Commission(
        address indexed from,
        address indexed to,
        uint256 totalAmount,
        uint256 commissionAmount
    );

    constructor() ERC20("ARTH Valuecoin", "ARTH") ERC20Permit("ARTH") {}

    /**
     * @dev Make an ERC20 transfer with a commision to someone based on a signature (making this tx gasless)
     */
    function payWithCommisionWithPermit(
        address from,
        address to,
        uint256 amount,
        uint256 commissionAmount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external virtual {
        require(block.timestamp <= deadline, "ARTHValuecoin: expired deadline");

        // verify the signature
        bytes32 structHash = keccak256(
            abi.encode(
                _COMMIT_TYPEHASH,
                from,
                to,
                amount,
                commissionAmount,
                _useNonce(from),
                deadline
            )
        );
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, v, r, s);
        require(signer == from, "ARTHValuecoin: invalid signature");

        // send the tokens
        _transfer(from, to, amount);

        // send and log the commision
        _transfer(from, msg.sender, commissionAmount);
        emit Commission(
            from,
            msg.sender,
            amount + commissionAmount,
            commissionAmount
        );
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(address(to) != address(this), "dont send to token contract");
    }
}
