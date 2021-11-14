// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib/TokenVesting.sol";

/**
 * @title TeamVesting
 * @dev Team tokens are vested for 3 years starting from Dec 17th 2021
 */
contract TeamVesting is TokenVesting {
    constructor(address beneficiary)
        public
        TokenVesting(beneficiary, 1639699200, 0, 94608000, true)
    {}
}
