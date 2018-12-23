var SolTweet = artifacts.require("./SolTweet.sol");

module.exports = function(deployer) {
  deployer.deploy(SolTweet);
};
