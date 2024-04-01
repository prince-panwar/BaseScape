const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Stake", (m) => {
 const stake = m.contract("FixedStaking",["0x2a4c6394886502942d4Dd3d0Fd5E0B6245136f0d"]);
  return { stake };
});
