const assert = require('assert');

const ganache = require('ganache-cli');

const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const json = require('./../build/contracts/SolTweet.json');

const SolTweet = artifacts.require("SolTweet");

const createUsers = async (instance, usernames) => {
    let i = 0;
    for(let username of usernames) {
      const tx = await instance._createUser(username);
      const currUser = (await instance.users.call(i));
      let [currUsername, currFollowerCount] = currUser;
      assert(currUsername === username, 'incorrect username');
      assert(currFollowerCount.toNumber() === 0, 'incorrect number of followers');
      i++;
    }
}

const getFakeUsernames = (numUsernames) => {
  const fakeUsernames = [];
  for(let i = 0; i < numUsernames; i++) {
    fakeUsernames.push(`fake-user-${i}`);
  }
  return fakeUsernames;
}

describe('SolTweet', () => {
  it('creates users', async () => {
    const instance = await SolTweet.deployed();
    await createUsers(instance, getFakeUsernames(2));
  })

  it('creates tweets', async () => {
    const instance = await SolTweet.deployed();
    await createUsers(instance, getFakeUsernames(2));
    let i = 0;
    for(let tweetText of ['fake-tweet-1', 'fake-tweet-2']) {
      const tx = await instance._createTweet(i, tweetText);
      const currTweet = (await instance.tweets.call(i));
      let [currTweetText, currTweetLikes] = currTweet;
      assert(currTweetText === tweetText, 'incorrect tweetText');
      assert(currTweetLikes.toNumber() === 0, 'incorrect number of tweet likes');
      i++;
    }
  })

  it('likes tweets', async () => {
    const instance = await SolTweet.deployed();
    await createUsers(instance, getFakeUsernames(2));
    const [userAId, userBId] = [0, 1];
    const tx = await instance._createTweet(userAId, 'fake-tweet-text');
    const tweetId = 0;
    await instance._likeTweet(userBId, tweetId);
    const tweet = (await instance.tweets.call(tweetId));
    const numLikes = tweet[1].toNumber();
    assert(numLikes === 1, 'incorrect number of likes');
  })

  it('follows user', async () => {

  })

  it('unfollows user', async () => {

  })
})