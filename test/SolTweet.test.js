const assert = require('assert');

const ganache = require('ganache-cli');

const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const json = require('./../build/contracts/SolTweet.json');

const SolTweet = artifacts.require("SolTweet");

const createUsers = async (instance, usernames) => {
  let users = []
  let i = 0;
  for(let username of usernames) {
    const tx = await instance._createUser(username);
    const currUser = (await instance.users.call(i));
    let [currUsername, currFollowerCount] = currUser;
    assert(currUsername === username, 'incorrect username');
    assert(currFollowerCount.toNumber() === 0, 'incorrect number of followers');
    users.push(currUser);
    i++;
  }
  return users;
}

const getFakeUsernames = (numUsernames) => {
  const fakeUsernames = [];
  for(let i = 0; i < numUsernames; i++) {
    fakeUsernames.push(`fake-user-${i}`);
  }
  return fakeUsernames;
}

contract('SolTweet', (accounts) => {
  let instance;
  let users;

  before(async () => {
    instance = await SolTweet.deployed();
    users = await createUsers(instance, getFakeUsernames(2));
  })

  describe('user tests', () => {
    const [userAId, userBId] = [0, 1];

    it('creates users', async () => {
      assert.strictEqual(users.length, 2);
    })

    it('follows user', async () => {
      await instance._follow(userAId, userBId);
      let userB = (await instance.users.call(userBId));
      let numFollowers = userB[1].toNumber();
      assert(numFollowers === 1, 'incorrect number of followers');
  
      let followingMappingKeys = await instance._getFollowingMappingKeys.call(userAId);
      assert.equal(followingMappingKeys[0].toNumber(), userBId);
      assert(await instance.followingMapping.call(userAId, userBId));
  
      // User can't double follow
      let err;
      try {
        await instance._follow(userAId, userBId);
      } catch (e) {
        err = e;
      }
      assert(err);
    })

    it('unfollows user', async () => {
      await instance._unFollow(userAId, userBId);
      userB = (await instance.users.call(userBId));
      numFollowers = userB[1].toNumber();
      assert(numFollowers === 0, 'incorrect number of followers');
    })

    it('refollows user', async () => {
      await instance._follow(userAId, userBId);
  
      followingMappingKeys = await instance._getFollowingMappingKeys.call(userAId);
      assert.equal(followingMappingKeys[0].toNumber(), userBId);
    })
  })

  describe('tweet tests', () => {
    let events = [];
    let tweets = [];
    before(async () => {
      let i = 0;
      for(let tweetText of ['fake-tweet-1', 'fake-tweet-2']) {
        const tx = await instance._createTweet(i, tweetText);
        events.push(tx.logs[0].event);
        const currTweet = (await instance.tweets.call(i));
        tweets.push(currTweet);
        i++;
      }
    })

    it('creates tweets', async () => {
      assert.strictEqual(tweets.length, 2);
    })

    it('emits new tweet events', () => {
      assert.strictEqual(events.length, 2);
      assert.strictEqual(events[0], 'NewTweet');
    })

    it('likes tweets', async () => {
      let userBId = 1;
      const tweetId = 0;
      await instance._likeTweet(userBId, tweetId);
      const tweet = (await instance.tweets.call(tweetId));
      const numLikes = tweet[1].toNumber();
      assert.strictEqual(numLikes, 1, 'incorrect number of likes');
    })
  })
})