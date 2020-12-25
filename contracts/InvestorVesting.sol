pragma solidity ^0.6.0;

import "./TokenVesting.sol";

/**
 * @title InvestorVesting
 * @dev Seed, Private and Advisory tokens are vested for 11 months. starting Dec 17th 2020
 */
contract InvestorVesting is TokenVesting {
    constructor(address beneficiary)
        public
        TokenVesting(beneficiary, 1608163200, 0, 28512000, true)
    {}
}
