// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib/TokenVesting.sol";

/**
 * @title InvestorVesting
 * @dev Seed, Private and Advisory tokens are vested for 11 months. starting Dec 17th 2020
 */
contract InvestorVesting is TokenVesting {
    constructor(address beneficiary)
        public
        TokenVesting(beneficiary, 1608163200, 0, 86400 * 30 * 11, true)
    {}
}
