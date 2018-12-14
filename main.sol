pragma solidity ^0.5.0;

import "./SafeMath.sol";

contract SolTweet {
    using SafeMath for uint256;

    event NewUser(uint userId);
    event NewTweet(uint tweetId);

    mapping (uint => address) userToOwner;
    mapping (uint => uint) tweetToUserId;
    mapping (uint => bool) userHasLikedTweet;

    User[] public users;
    Tweet[] public tweets;

    struct User {
        string username;
        uint[] followers;
        uint[] following;
    }

    struct Tweet {
        string text;
        uint likes;
    }

    function _createUser(string memory _username) public {
        // uint userId = uint(keccak256(abi.encodePacked(_username)));
        User memory newUser;
        newUser.username = _username;
        uint id = (users.push(newUser)).sub(1);
        userToOwner[id] = msg.sender;
        emit NewUser(id);
    }

    function _createTweet(uint _userId, string memory _tweetText) public {
        require(userToOwner[_userId] == msg.sender, "unauthorized sender");
        uint id = (tweets.push(Tweet(_tweetText, 0))).sub(1);
        tweetToUserId[id] = _userId;
        // notify followers?
        emit NewTweet(id);
    }

    function _likeTweet(uint _userId, uint _tweetId) public {
        bool userLikedTweet = userHasLikedTweet[uint(keccak256(abi.encodePacked(_userId, _tweetId)))];
        require(!userLikedTweet, "user already liked tweet");
        tweets[_tweetId].likes.add(1);
    }

    function _follow() public {

    }
}