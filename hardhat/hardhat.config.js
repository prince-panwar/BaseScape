require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:{
    sepolia:{
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts:["b28cdbbc81d46f0b68b2d56bbb6720f4d0a40dd2577f077b9b11a7ff9b1defef"]
    }
  },
  etherscan: {
    apiKey: "QHVX6I56142DE98US7FT9WNQIAT4YMR1NE",
  },
};
