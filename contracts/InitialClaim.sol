// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract InitialClaim is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    event InvestorsAdded(
        address[] investors,
        uint256[] tokenAllocations,
        address caller
    );

    event InvestorAdded(
        address indexed investor,
        address indexed caller,
        uint256 allocation
    );

    event InvestorRemoved(
        address indexed investor,
        address indexed caller,
        uint256 allocation
    );

    event WithdrawnTokens(address indexed investor, uint256 value);

    event DepositInvestment(address indexed investor, uint256 value);

    event TransferInvestment(address indexed owner, uint256 value);

    event RecoverToken(address indexed token, uint256 indexed amount);

    uint256 private _totalAllocatedAmount;
    uint256 private _initialTimestamp;
    IERC20 private _sclpToken;
    address[] public investors;

    struct Investor {
        bool exists;
        uint256 withdrawnTokens;
        uint256 tokensAllotment;
    }

    mapping(address => Investor) public investorsInfo;

    /// @dev Boolean variable that indicates whether the contract was initialized.
    bool public isInitialized = false;
    /// @dev Boolean variable that indicates whether the investors set was finalized.
    bool public isFinalized = false;

    /// @dev Checks that the contract is initialized.
    modifier initialized() {
        require(isInitialized, "not initialized");
        _;
    }

    /// @dev Checks that the contract is initialized.
    modifier notInitialized() {
        require(!isInitialized, "initialized");
        _;
    }

    modifier onlyInvestor() {
        require(investorsInfo[_msgSender()].exists, "Only investors allowed");
        _;
    }

    constructor(address _token) {
        _sclpToken = IERC20(_token);
    }

    receive() external payable {}

    function getInitialTimestamp() public view returns (uint256 timestamp) {
        return _initialTimestamp;
    }

    /// @dev release tokens to all the investors
    function releaseTokens() external onlyOwner initialized {
        for (uint8 i = 0; i < investors.length; i++) {
            uint256 availableTokens = withdrawableTokens(investors[i]);
            _sclpToken.safeTransfer(investors[i], availableTokens);
        }
    }

    /// @dev Adds investors. This function doesn't limit max gas consumption,
    /// so adding too many investors can cause it to reach the out-of-gas error.
    /// @param _investors The addresses of new investors.
    /// @param _tokenAllocations The amounts of the tokens that belong to each investor.
    function addInvestors(
        address[] calldata _investors,
        uint256[] calldata _tokenAllocations
    ) external onlyOwner {
        require(
            _investors.length == _tokenAllocations.length,
            "different arrays sizes"
        );
        for (uint256 i = 0; i < _investors.length; i++) {
            _addInvestor(_investors[i], _tokenAllocations[i]);
        }
        emit InvestorsAdded(_investors, _tokenAllocations, msg.sender);
    }

    /// @dev Adds investor. This function doesn't limit max gas consumption,
    /// so adding too many investors can cause it to reach the out-of-gas error.
    /// @param _investor The addresses of new investors.
    /// @param _tokensAllotment The amounts of the tokens that belong to each investor.
    function _addInvestor(address _investor, uint256 _tokensAllotment)
        internal
        onlyOwner
    {
        require(_investor != address(0), "Invalid address");
        require(
            _tokensAllotment > 0,
            "the investor allocation must be more than 0"
        );
        Investor storage investor = investorsInfo[_investor];

        require(investor.tokensAllotment == 0, "investor already added");

        investor.tokensAllotment = _tokensAllotment * 10**18;
        investor.exists = true;
        investors.push(_investor);
        _totalAllocatedAmount = _totalAllocatedAmount.add(_tokensAllotment);
        emit InvestorAdded(_investor, _msgSender(), _tokensAllotment);
    }

    // 15% on listing and rest daily distribution from day 31 for 11 months (12 months)
    function withdrawTokens() external onlyInvestor initialized {
        Investor storage investor = investorsInfo[_msgSender()];

        uint256 tokensAvailable = withdrawableTokens(_msgSender());
        uint256 dexBalance = _sclpToken.balanceOf(address(this));
        require(tokensAvailable > 0, "No tokens available for withdrawl");
        require(
            tokensAvailable <= dexBalance,
            "Not enough tokens in the reserve"
        );

        investor.withdrawnTokens = investor.withdrawnTokens.add(
            tokensAvailable
        );
        _sclpToken.safeTransfer(_msgSender(), tokensAvailable);

        emit WithdrawnTokens(_msgSender(), tokensAvailable);
    }

    /// @dev The starting time of TGE
    /// @param _timestamp The initial timestamp, this timestap should be used for vesting
    function setInitialTimestamp(uint256 _timestamp)
        external
        onlyOwner
        notInitialized
    {
        isInitialized = true;
        _initialTimestamp = _timestamp;
    }

    function withdrawableTokens(address _investor)
        public
        view
        returns (uint256 tokens)
    {
        Investor storage investor = investorsInfo[_investor];
        //uint256 availablePercentage = _calculateAvailablePercentage();
        uint256 noOfTokens = investor.tokensAllotment;
        uint256 tokensAvailable = noOfTokens.sub(investor.withdrawnTokens);

        return tokensAvailable;
    }

    function recoverToken(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).safeTransfer(_msgSender(), _amount);
        emit RecoverToken(_token, _amount);
    }
}
