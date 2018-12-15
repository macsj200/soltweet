var SolTweet = artifacts.require("SolTweet");

module.exports = function(deployer) {
  // console.log(SolTweet);
  deployer.deploy(SolTweet);
};