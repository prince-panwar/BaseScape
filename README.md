# FixedStaking Smart Contract

## Overview

The `FixedStaking` smart contract allows users to stake tokens for a fixed duration and earn rewards based on the Annual Percentage Yield (APY).

## Features

- Users can stake tokens for multiple predefined durations.
- Rewards are calculated based on the duration of the stake and the APY.
- Supports early withdrawal with a penalty.


## Contract Architecture

The contract comprises the following main components:

- **Stake:** A struct to represent a user's stake, containing information such as amount, duration, start time, APY, and withdrawal status.
- **Mappings:**
  - `userStakes`: Maps users to their stakes.
  - `durationToAPY`: Maps durations to their corresponding APYs.
- **Events:**
  - `Staked`: Fired when a user stakes tokens.
  - `Withdrawn`: Fired when a user withdraws tokens.
- **Modifiers:**
  - `onlyOwner`: Ensures that only the contract owner can execute certain functions.
- **Functions:**
  - `stakeTokens`: Allows users to stake tokens for a specified duration.
  - `withdrawTokens`: Allows users to withdraw tokens from a stake.
  - `calculateReward`: Internal function to calculate the reward for a stake.
  - `getStakes`: Allows users to get their stakes.
  - `updateAPY`: Allows the contract owner to update APYs for different durations.

## Functions

### `stakeTokens(uint256 _selectedDurationIndex, uint256 _amount) external nonReentrant`

Allows users to stake tokens for a specified duration.

- `_selectedDurationIndex`: Index of the selected duration from the `stakingDurations` array.
- `_amount`: Amount of tokens to stake.

### `withdrawTokens(uint256 _stakeIndex) external nonReentrant returns (uint256)`

Allows users to withdraw tokens from a stake.

- `_stakeIndex`: Index of the stake to withdraw from.

### `calculateRewardForStake(address _user, uint256 _stakeIndex) external view returns (uint256)`

Calculates the reward for a specific stake of a user.

- `_user`: Address of the user.
- `_stakeIndex`: Index of the stake.

### `calculateTotalRewardForStake(address _user, uint256 _stakeIndex) external view returns (uint256)`

Calculates the total reward for a specific stake of a user including taxes.

- `_user`: Address of the user.
- `_stakeIndex`: Index of the stake.

### `getStakes(address _user) external view returns (Stake[] memory)`

Returns an array of stakes for a user.

- `_user`: Address of the user.

### `updateAPY(uint256 _duration, uint256 _newAPY) external onlyOwner`

Allows the contract owner to update APYs for different durations.

- `_duration`: Duration for which to update APY (in seconds).
- `_newAPY`: New APY for the specified duration (in basis points).
