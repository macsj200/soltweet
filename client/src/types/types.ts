export interface Tweet {
  author: string
  authorId: number
  text: string
  id: string
  likeCount: number
}

export interface EventResult {
  returnValues: any
}

export interface LikeCountChangeResult extends EventResult {
  returnValues: {
    likeCount: number
    tweetId: number
  }
}

export interface NewTweetResult extends EventResult {
  returnValues: {
    tweetId: number
  }
}

export interface Contract {
  events: object
  methods: object
}

export type address = number

export interface SolTweetContract extends Contract {
  events: {
    LikeCountChange: (
      filter: object,
      callback: (err: Error, res?: LikeCountChangeResult) => void
    ) => any
    NewTweet: (
      filter: object,
      callback: (err: Error, res?: NewTweetResult) => void
    ) => any
  }
  // TODO specify return values
  methods: {
    followingMapping: (userId: number, followingUserId: number) => any
    tweets: (tweetId: number) => any
    ownerHasAccount: (address: address) => any
    ownerToUser: (address: address) => any
    users: (userId: number) => any
    _follow: (userId: number, _userIdToFollow: number) => any
    _createTweet: (userId: number, tweetText: string) => any
    _createUser: (username: string) => any
    _getFollowingMappingKeys: (userId: number) => any
    _getNumberOfTweets: () => any
    _likeTweet: (userId: number, tweetId: number) => any
  }
}
