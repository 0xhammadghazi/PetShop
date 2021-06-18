var PetShop = artifacts.require("./PetShop.sol");

module.exports = function (deployer) {
  await deployer.deploy(
    PetShop,
    "Pip's Pet Shop",
    "PPS",
    "https://ipfs.io/ipfs/"
  );
};
