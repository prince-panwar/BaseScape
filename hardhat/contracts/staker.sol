// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FixedStaking is ReentrancyGuard {
    IERC20 public stakingToken;

    // Struct to store staking details
    struct StakingInfo {
        address staker;
        uint256 amount;
        uint256 duration; // in seconds
        uint256 startTime;
        uint256 apy; // Annual Percentage Yield (in basis points, e.g., 5000 for 50%)
        bool isWithdrawn;
    }

    // Available staking durations (in seconds)
    uint256[] public stakingDurations = [7 days, 14 days, 21 days, 30 days, 60 days];

    // Constants for APY and withdrawal tax
   
    uint256 public constant WITHDRAWAL_TAX_PERCENT = 1; // 4% withdrawal tax

    // Total amount staked
    uint256 public totalStaked;

    // Mapping from staker address to their staking info
    mapping(address => StakingInfo) public stakingData;

    // Mapping from duration to APY
    mapping(uint256 => uint256) public durationToAPY;

    // Event emitted when a user stakes tokens
    event Staked(address indexed staker, uint256 amount, uint256 duration);

    // Event emitted when a user withdraws staked tokens
    event Withdrawn(address indexed staker, uint256 amount);

    constructor(address _token) {
        stakingToken = IERC20(_token);

        // Initialize the mapping with your specific APY values for each duration
        durationToAPY[7 days] = 4100; // 41% APY
        durationToAPY[14 days] = 4200; // 42% APY
        durationToAPY[21 days] = 4300; // 43% APY
        durationToAPY[30 days] = 4400; // 44% APY
        durationToAPY[60 days] = 4500; // 45% APY
    }

    // Stake tokens with user-selectable duration
    function stakeTokens(uint256 _selectedDurationIndex, uint256 _amount) external {
        require(_selectedDurationIndex < stakingDurations.length, "Invalid duration index");
        require(stakingToken.balanceOf(msg.sender) >= _amount, "Insufficient Balance");
        StakingInfo storage existingStake = stakingData[msg.sender];
        require(existingStake.isWithdrawn || existingStake.amount == 0, "You have already staked tokens and not yet withdrawn them");
        uint256 selectedDuration = stakingDurations[_selectedDurationIndex];
        uint256 APY= durationToAPY[selectedDuration];

        stakingData[msg.sender] = StakingInfo({
            staker: msg.sender,
            amount: _amount,
            duration: selectedDuration,
            startTime: block.timestamp,
            apy: APY,
            isWithdrawn: false
        });

        totalStaked += _amount;
       
        bool TransferSuccess = stakingToken.transferFrom(msg.sender, address(this), _amount);
        require(TransferSuccess, "Transfer Failed");

        emit Staked(msg.sender, _amount, selectedDuration);
    }






    // Withdraw staked tokens after the staking period
   function withdrawTokens() external {
    
    StakingInfo storage stakingInfo = stakingData[msg.sender];
    require(!stakingInfo.isWithdrawn, "Tokens already withdrawn");
    require(block.timestamp >= stakingInfo.startTime + stakingInfo.duration, "Staking period not over");

    
    // Calculate yield
    uint256 yield = (stakingInfo.amount * stakingInfo.apy * stakingInfo.duration) / (365 days * 10000);

    // Apply the withdrawal tax
    uint256 withdrawalTax = (yield * WITHDRAWAL_TAX_PERCENT) / 100;
    uint256 finalAmount = stakingInfo.amount + yield - withdrawalTax;

    // Mark as withdrawn
    stakingInfo.isWithdrawn = true;
   //update total staked amount
    if(finalAmount>totalStaked){
        totalStaked=0;
    }else{
    totalStaked-=finalAmount;
    }
    // Transfer tokens to the staker
    bool success = stakingToken.transfer(msg.sender, finalAmount);
    require(success, "Transfer Failed");

    emit Withdrawn(msg.sender, finalAmount);
  }

  function getTVL() external view returns (uint256) {
    return stakingToken.balanceOf(address(this));
  }

}
