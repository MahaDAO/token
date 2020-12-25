pragma solidity ^0.6.0;

import "./TokenVesting.sol";

/**
 * @title CommunityVesting
 * @dev Community tokens are vested for 10 years starting Dec 17th 2020
 */
contract CommunityVesting is TokenVesting {
    constructor(address beneficiary)
        public
        TokenVesting(beneficiary, 1608163200, 0, 315360000, true)
    {}
}
