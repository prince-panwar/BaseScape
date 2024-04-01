// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FixedStaking is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public stakingToken;
    address public owner;

    struct Stake {
        uint256 amount;
        uint256 duration;
        uint256 startTime;
        uint256 apy;
        bool isWithdrawn;
    }

    mapping(address => Stake[]) public userStakes;
    mapping(uint256 => uint256) public durationToAPY;
    uint256[] public stakingDurations = [7 days, 14 days, 21 days, 30 days, 60 days];
    uint256 public constant WITHDRAWAL_TAX_PERCENT = 1;
    uint256 public constant EARLY_WITHDRAWAL_TAX_PERCENT = 4;
    uint256 public totalStaked;

    event Staked(address indexed staker, uint256 amount, uint256 duration);
    event Withdrawn(address indexed staker, uint256 amount);

    constructor(address _token) {
        stakingToken = IERC20(_token);
        durationToAPY[7 days] = 4100; // 41% APY
        durationToAPY[14 days] = 4200; // 42% APY
        durationToAPY[21 days] = 4300; // 43% APY
        durationToAPY[30 days] = 4400; // 44% APY
        durationToAPY[60 days] = 4500; // 45% APY
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function stakeTokens(uint256 _selectedDurationIndex, uint256 _amount) external nonReentrant {
        require(_selectedDurationIndex < stakingDurations.length, "Invalid duration index");
        require(stakingToken.balanceOf(msg.sender) >= _amount, "Insufficient Balance");
        uint256 selectedDuration = stakingDurations[_selectedDurationIndex];
        uint256 APY = durationToAPY[selectedDuration];

        userStakes[msg.sender].push(Stake({
            amount: _amount,
            duration: selectedDuration,
            startTime: block.timestamp,
            apy: APY,
            isWithdrawn: false
        }));

        totalStaked += _amount;

        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);

        emit Staked(msg.sender, _amount, selectedDuration);
    }

    function withdrawTokens(uint256 _stakeIndex) external nonReentrant returns (uint256){
        require(_stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        Stake storage stake = userStakes[msg.sender][_stakeIndex];
        require(!stake.isWithdrawn, "Tokens already withdrawn");

        uint256 RewardAmount = calculateReward(stake);
        uint256 finalAmount = stake.amount+RewardAmount;
        stake.isWithdrawn = true;
        totalStaked -= finalAmount;

        stakingToken.safeTransfer(msg.sender, finalAmount);

        emit Withdrawn(msg.sender, finalAmount);
        return finalAmount;
    }

    function calculateReward(Stake storage _stake) internal view returns (uint256) {
        uint256 elapsedTime = block.timestamp - _stake.startTime;
        uint256 withdrawalTax;
        
        if (elapsedTime >= _stake.duration) {
            // Calculate reward based on the pool duration
            uint256 yield = (_stake.amount * _stake.apy * (_stake.duration / 86400)) / (365 days * 10000);
            withdrawalTax = (yield * WITHDRAWAL_TAX_PERCENT) / 100;
            return yield - withdrawalTax;
        } else {
            // Calculate reward based on the number of days staked
            uint256 partialYield = (_stake.amount * _stake.apy * (elapsedTime/86400)) / (365 days * 10000);
            withdrawalTax = (partialYield * EARLY_WITHDRAWAL_TAX_PERCENT) / 100;
            return partialYield - withdrawalTax;
        }
    }
    
    function calculateRewardForStake(address _user, uint256 _stakeIndex) external view returns (uint256) {
        require(_stakeIndex < userStakes[_user].length, "Invalid stake index");
        Stake storage stake = userStakes[_user][_stakeIndex];
        return calculateReward(stake);
    }
  
   

    function getStakes(address _user) external view returns (Stake[] memory) {
        return userStakes[_user];
    }

    function updateAPY(uint256 _duration, uint256 _newAPY) external onlyOwner {
        require(_newAPY > 0, "Invalid APY");
        durationToAPY[_duration] = _newAPY;
    }


    function getTVL() external view returns (uint256) {
        return stakingToken.balanceOf(address(this));
    }
}
