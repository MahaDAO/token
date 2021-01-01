pragma solidity ^0.6.0;

import "./TokenVesting.sol";

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
