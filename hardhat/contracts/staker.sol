// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FixedStaking is ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public stakingToken;
    address public owner;

    struct Stake {
        uint256 amount;
        uint256 duration;
        uint256 startTime;
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
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    constructor(address _token, address _owner) {
        stakingToken = IERC20(_token);
        owner = _owner;
        durationToAPY[7 days] = 12; 
        durationToAPY[14 days] = 26; 
        durationToAPY[21 days] = 58; 
        durationToAPY[30 days] = 80; 
        durationToAPY[60 days] = 120; 
       
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function stakeTokens(uint256 _selectedDurationIndex, uint256 _amount) external nonReentrant whenNotPaused {
        require(_selectedDurationIndex < stakingDurations.length, "Invalid duration index");
        require(stakingToken.balanceOf(msg.sender) >= _amount, "Insufficient Balance");
        require(_amount > 0, "Invalid amount");
        uint256 selectedDuration = stakingDurations[_selectedDurationIndex];
        

        userStakes[msg.sender].push(Stake({
            amount: _amount,
            duration: selectedDuration,
            startTime: block.timestamp,
            isWithdrawn: false
        }));

        totalStaked += _amount;

        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);

        emit Staked(msg.sender, _amount, selectedDuration);
    }

    function withdrawTokens(uint256 _stakeIndex) external nonReentrant whenNotPaused returns (uint256){
        require(_stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        Stake storage stake = userStakes[msg.sender][_stakeIndex];
        require(!stake.isWithdrawn, "Tokens already withdrawn");

        uint256 RewardAmount = calculateReward(stake);
        uint256 finalAmount = stake.amount+RewardAmount;
        stake.isWithdrawn = true;
        totalStaked -= stake.amount;

        stakingToken.safeTransfer(msg.sender, finalAmount);

        emit Withdrawn(msg.sender, finalAmount);
        return finalAmount;
    }


    function calculateReward(Stake storage _stake) internal view returns (uint256) {
        uint256 elapsedTime = block.timestamp - _stake.startTime;
        uint256 withdrawalTax;
        uint256 scalingFactor = 1e9; // Define a scaling factor for precision
        uint256 apy = durationToAPY[_stake.duration];
        if(elapsedTime> _stake.duration){
            elapsedTime = _stake.duration;
        }

        // Calculate yield based on the duration
        uint256 yield = (_stake.amount * apy * elapsedTime) / (86400 * 365 * 100);
       
       // Calculate the withdrawal tax based on the duration
        if (elapsedTime >= _stake.duration) {
            withdrawalTax = (yield * WITHDRAWAL_TAX_PERCENT) / 100;
        } else {
            withdrawalTax = (yield * EARLY_WITHDRAWAL_TAX_PERCENT) / 100;
        }

        // Apply the scaling factor to the yield and the withdrawal tax
        yield = yield * scalingFactor;
        withdrawalTax = withdrawalTax * scalingFactor;

        return (yield - withdrawalTax) / scalingFactor;
    }

    
    function calculateRewardsForUser(address _user) external view returns (uint256[] memory) {
        Stake[] storage stakes = userStakes[_user];
        uint256[] memory rewards = new uint256[](stakes.length);

        for (uint256 i = 0; i < stakes.length; i++) {
            rewards[i] = calculateReward(stakes[i]);
        }

        return rewards;
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

    function pause() external onlyOwner {
    _pause();
    }

    function unpause() external onlyOwner {
    _unpause();
    }
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}