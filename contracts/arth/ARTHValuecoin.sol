// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ARTHValuecoin is ERC20, ERC20Permit {
    bytes32 private immutable _COMMIT_TYPEHASH =
        keccak256(
            "Commit(address from, address to, uint256 amount, address commissionTo, uint256 commissionAmount, uint256 deadline)"
        );

    constructor() ERC20("ARTH Valuecoin", "ARTH") ERC20Permit("ARTH") {}

    function payWithCommision(
        address to,
        uint256 amount,
        address commissionTo,
        uint256 commissionAmount
    ) external virtual {
        _transfer(msg.sender, to, amount);
        _transfer(msg.sender, commissionTo, commissionAmount);
    }

    function payWithCommisionWithPermit(
        address from,
        address to,
        uint256 amount,
        address commissionTo,
        uint256 commissionAmount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external virtual {
        require(block.timestamp <= deadline, "ARTHValuecoin: expired deadline");

        bytes32 structHash = keccak256(
            abi.encode(
                _COMMIT_TYPEHASH,
                from,
                to,
                amount,
                commissionTo,
                commissionAmount,
                deadline,
                _useNonce(from),
                deadline
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);

        address signer = ECDSA.recover(hash, v, r, s);
        require(signer == from, "ARTHValuecoin: invalid signature");

        _transfer(from, to, amount);
        _transfer(from, commissionTo, commissionAmount);
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
