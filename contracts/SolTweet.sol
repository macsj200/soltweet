pragma solidity ^0.4.24;

import "./SafeMath.sol";

// TODO fixing following mapping for notifying all followers
// TODO break out user and tweet into separate files

contract SolTweet {
    using SafeMath for uint256;

    event NewUser(uint userId);
    event NewTweet(uint tweetId, uint indexed userId);

    mapping (uint => address) userToOwner;
    mapping (address => uint) public ownerToUser;
    mapping (address => bool) public ownerHasAccount;
    mapping (uint => uint) tweetToUserId;
    mapping (uint => bool) userHasLikedTweet;
    mapping (uint => mapping (uint => bool)) public followingMapping;
    mapping (uint => uint[]) public followingMappingKeys;

    struct User {
        string username;
        uint followerCount;
    }

    struct Tweet {
        string text;
        uint likes;
        uint authorId;
    }

    User[] public users;
    Tweet[] public tweets;

    function _getFollowingMappingKeys(uint _userId) public view returns (uint[] memory) {
        return followingMappingKeys[_userId];
    }

    function _getNumberOfTweets() public view returns (uint) {
        return tweets.length;
    }

    function _createUser(string memory _username) public returns (uint) {
        User memory newUser;
        newUser.username = _username;
        newUser.followerCount = 0;
        uint id = (users.push(newUser)).sub(1);
        userToOwner[id] = msg.sender;
        ownerToUser[msg.sender] = id;
        ownerHasAccount[msg.sender] = true;
        emit NewUser(id);
        return id;
    }

    function _createTweet(uint _userId, string memory _tweetText) public returns (uint) {
        require(userToOwner[_userId] == msg.sender, "unauthorized sender");
        uint id = (tweets.push(Tweet(_tweetText, 0, _userId))).sub(1);
        tweetToUserId[id] = _userId;
        // notify followers

        //look up all the users follwers and let them know about the new tweet
        // following[];
        emit NewTweet(id, _userId);
        return id;
    }

    function _likeTweet(uint _userId, uint _tweetId) public {
        require(userToOwner[_userId] == msg.sender, "unauthorized sender");
        bool userLikedTweet = userHasLikedTweet[uint(keccak256(abi.encodePacked(_userId, _tweetId)))];
        require(!userLikedTweet, "user already liked tweet");
        Tweet storage myTweet = tweets[_tweetId];
        myTweet.likes = myTweet.likes.add(1);
    }

    function _follow(uint _userId, uint _userIdToFollow) public {
        require(userToOwner[_userId] == msg.sender, "unauthorized sender");
        //check that the users isn't already following
        require(!followingMapping[_userId][_userIdToFollow], "user already following");
        
        //add the follower and increase follower count
        // following[_userId] = _userIdToFollow;
        User storage userToFollow = users[_userIdToFollow];
        userToFollow.followerCount = userToFollow.followerCount.add(1);
        followingMapping[_userId][_userIdToFollow] = true;
        followingMappingKeys[_userId].push(_userIdToFollow);
    }

    function _unFollow(uint _userId, uint _userIdToUnFollow) public {
        require(userToOwner[_userId] == msg.sender, "unauthorized sender");
        //check that the users is already following
        // require(following[_userId] == _userIdToUnFollow, "sender is not following");
        
        //remove the follower and decrease follower count
        // delete following[_userId];
        User storage userToUnFollow = users[_userIdToUnFollow];
        followingMapping[_userId][_userIdToUnFollow] = false;
        userToUnFollow.followerCount = userToUnFollow.followerCount.sub(1);
    }
}