// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib/TokenVesting.sol";

/**
 * @title CommunityVesting
 * @dev Community tokens are vested for 119 months starting Dec 17th 2020 (considering a month to be 30 days)
 */
contract CommunityVesting is TokenVesting {
    constructor(address beneficiary)
        public
        TokenVesting(beneficiary, 1608163200, 0, 86400 * 30 * 119, true)
    {}
}
