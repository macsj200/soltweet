pragma solidity ^0.5.0;

import "./SafeMath.sol";

// TODO fixing following mapping for notifying all followers
// TODO break out user and tweet into separate files

contract SolTweet {
    using SafeMath for uint256;

    event NewUser(uint userId);
    event NewTweet(uint tweetId, uint indexed userId);

    mapping (uint => address) userToOwner;
    mapping (uint => uint) tweetToUserId;
    mapping (uint => bool) userHasLikedTweet;
    //maps follower => user they follow
    mapping (uint => bool) hasFollowed;

    User[] public users;
    Tweet[] public tweets;

    struct User {
        string username;
        uint followerCount;
    }

    struct Tweet {
        string text;
        uint likes;
    }

    function _createUser(string memory _username) public {
        User memory newUser;
        newUser.username = _username;
        newUser.followerCount = 0;    
        uint id = (users.push(newUser)).sub(1);
        userToOwner[id] = msg.sender;
        emit NewUser(id);
    }

    function _createTweet(uint _userId, string memory _tweetText) public {
        require(userToOwner[_userId] == msg.sender, "unauthorized sender");
        uint id = (tweets.push(Tweet(_tweetText, 0))).sub(1);
        tweetToUserId[id] = _userId;
        // notify followers

        //look up all the users follwers and let them know about the new tweet
        following[]
        emit NewTweet(id, _userId);
    }

    function _likeTweet(uint _userId, uint _tweetId) public {
        require(userToOwner[_userId] == msg.sender, "unauthorized sender");
        bool userLikedTweet = userHasLikedTweet[uint(keccak256(abi.encodePacked(_userId, _tweetId)))];
        require(!userLikedTweet, "user already liked tweet");
        tweets[_tweetId].likes.add(1);
    }

    function _follow(uint _userId, uint _userIdToFollow) public {
        require(userToOwner[_userId] == msg.sender, "unauthorized sender");
        bool userHasFollowed = userHasLikedTweet[uint(keccak256(abi.encodePacked(_userId, _userIdToFollow)))];
        //check that the users isn't already following
        require(following[_userId] != _userIdToFollow, "sender is already following");
        
        //add the follower and increase follower count
        following[_userId] = _userIdToFollow;
        users[_userId].followerCount.add(1);
    }

    function _unFollow(uint _userId, uint _userIdToUnFollow) public {
        require(userToOwner[_userId] == msg.sender, "unauthorized sender");
        //check that the users is already following
        require(following[_userId] == _userIdToUnFollow, "sender is not following");
        
        //remove the follower and decrease follower count
        delete following[_userId];
        users[_userId].followerCount.sub(1);
    }
}