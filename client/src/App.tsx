import React, { Component } from 'react'
import { normalize } from 'normalizr'
import { tweetSchema } from './schemas'
import './App.css'
import Container from './components/container'
import { jsx, css, Global } from '@emotion/core'
import Tweet from './components/tweet'
import WriteTweet from './components/write-tweet'
import {
  Tweet as TweetType,
  LikeCountChangeResult,
  SolTweetContract,
  NewTweetResult,
} from './types/types'
import SolTweet from './contracts/SolTweet.json'
import { init } from './utils/init'
import CreateAccount from './components/create-account'
import { space2X, space1X, space4X, mq } from './css-variables'
import { colors } from '.'
import Button from './components/button'
jsx
/** @jsx jsx */
interface HandleSubmitTweetArgs {
  author: string
  tweetText: string
}

interface IState {
  tweets: TweetType[]
  web3: any
  accounts: any
  contract?: SolTweetContract
  username?: string
  userId?: number
  store: {
    result: string[]
    entities: {
      tweets: {
        [key: string]: TweetType
      }
    }
  }
  following: number[]
}

class App extends Component<{}, IState> {
  state: IState = {
    tweets: [],
    web3: null,
    accounts: null,
    store: {
      result: [],
      entities: {
        tweets: {},
      },
    },
    following: [],
  }

  componentDidMount = async () => {
    await init.bind(this)({
      compiledContract: SolTweet,
      // For local dev, comment out contractAddress
      contractAddress: '0x47267648c32753395f8d1dbfdc0ffbc86b3433a4',
    })
  }

  getContract = () => {
    const { contract } = this.state
    if (!contract) {
      throw new Error('contract not initialized')
    }
    return contract
  }

  getUserId = () => {
    const { userId } = this.state
    if (!userId) {
      throw new Error('not logged in')
    }
    return userId
  }

  fetchTweets = async () => {
    const { contract } = this.state
    const numberOfTweets = await this.getContract()
      .methods._getNumberOfTweets()
      .call()
    for (let i = 0; i < numberOfTweets; i++) {
      await this.fetchTweet(i)
    }
  }

  likeTweet = async (tweetId: number) => {
    const { accounts, contract } = this.state
    await this.getContract()
      .methods._likeTweet(this.getUserId(), tweetId)
      .send({ from: accounts[0] })
  }

  handleLikeCountChange = async (err: Error, res?: LikeCountChangeResult) => {
    if (err || !res) {
      // TODO implement an error toast
      return
    }
    const { likeCount, tweetId } = res.returnValues
    const { store } = this.state
    const tweet = store.entities.tweets[tweetId]
    tweet.likeCount = likeCount
    this.setState({ store: { ...store } })
  }

  fetchTweet = async (tweetId: number) => {
    const tweet = await this.getContract()
      .methods.tweets(tweetId)
      .call()
    const { text, authorId, likes } = tweet
    const author = await this.getContract()
      .methods.users(authorId)
      .call()
    const { username } = author
    this.getContract().events.LikeCountChange(
      {
        filter: {
          tweetId: tweetId.toString(),
        },
      },
      this.handleLikeCountChange
    )

    const { store } = this.state
    const normalized = normalize(
      {
        author: username,
        authorId,
        text,
        likeCount: likes,
        id: tweetId.toString(),
      },
      tweetSchema
    )
    store.entities.tweets = {
      ...store.entities.tweets,
      ...normalized.entities.tweets,
    }
    this.setState({ store: store })
  }

  computeFollowing = async () => {
    const userId = this.getUserId()
    const keys = await this.getContract()
      .methods._getFollowingMappingKeys(userId)
      .call()
    let result: number[] = []
    for (let followingUserId of keys) {
      const isFollowing = await this.getContract()
        .methods.followingMapping(userId, followingUserId)
        .call()
      if (isFollowing) {
        result = [...result, followingUserId]
      }
    }
    result.push(userId)
    this.setState({ following: result })
  }

  handleNewTweet = async (err: Error, res?: NewTweetResult) => {
    if (err || !res) {
      // TODO error toast
      return
    }
    const { tweetId } = res.returnValues
    await this.fetchTweet(tweetId)
  }

  setup = async () => {
    const { accounts } = this.state
    this.fetchTweets()
    const userHasAccount = await this.getContract()
      .methods.ownerHasAccount(accounts[0])
      .call()
    const userId = await this.getContract()
      .methods.ownerToUser(accounts[0])
      .call()
    if (userHasAccount && userId) {
      try {
        const user = await this.getContract()
          .methods.users(userId)
          .call()
        const { username } = user
        this.setState({
          userId,
          username,
        })
      } catch (err) {
        console.log('no user for address found')
      }
      await this.listenToFollowing()
    }
  }

  listenToFollowing = async () => {
    await this.computeFollowing()
    const { following } = this.state
    this.getContract().events.NewTweet(
      {
        filter: {
          userId: following,
        },
      },
      this.handleNewTweet
    )
  }

  handleSubmitTweet = async ({ tweetText }: HandleSubmitTweetArgs) => {
    const { accounts } = this.state

    const userId = this.getUserId()

    await this.getContract()
      .methods._createTweet(userId, tweetText)
      .send({ from: accounts[0] })
  }

  createAccount = async (username: string) => {
    const { accounts } = this.state

    await this.getContract()
      .methods._createUser(username)
      .send({ from: accounts[0] })

    const userId = await this.getContract()
      .methods.ownerToUser(accounts[0])
      .call()

    this.setState({
      username,
      userId,
    })
  }

  updateTweets = () => {
    this.fetchTweets()
  }

  followUser = async (userIdToFollow: number) => {
    const { accounts } = this.state
    await this.getContract()
      .methods._follow(this.getUserId(), userIdToFollow)
      .send({ from: accounts[0] })
    await this.listenToFollowing()
  }

  unFollowUser = async (userIdToUnFollow: number) => {
    const { accounts } = this.state
    await this.getContract()
      .methods._unFollow(this.getUserId(), userIdToUnFollow)
      .send({ from: accounts[0] })
    await this.listenToFollowing()
  }

  render() {
    const { username, userId } = this.state
    return (
      <Container>
        <Global
          styles={css`
            body {
              background-color: ${colors.darkestGrey};
              color: ${colors.white};
            }
          `}
        />
        <div>
          <h1
            css={css`
              text-align: center;
              color: ${colors.white};
              font-weight: 900;
            `}
          >
            SolTweet
          </h1>
          {userId ? (
            <div
              css={css`
                display: flex;
                flex-direction: row;

                @media (max-width: ${mq.aboveTablet}) {
                  flex-direction: column;
                }
              `}
            >
              <span
                css={css`
                  color: ${colors.lightGrey};
                  flex-grow: 1;
                  font-size: 1.25rem;
                  font-weight: 700;

                  @media (max-width: ${mq.aboveTablet}) {
                    font-size: 1rem;
                  }
                `}
              >
                Logged in as
                <span
                  css={css`
                    color: ${colors.white};
                  `}
                >
                  {' '}
                  {username}
                </span>
              </span>
              <div
                css={css`
                  margin-top: 0;
                  flex-grow: 1;

                  @media (max-width: ${mq.aboveTablet}) {
                    margin-top: ${space2X};
                  }
                `}
              >
                <WriteTweet handleSubmitTweet={this.handleSubmitTweet} />
              </div>
            </div>
          ) : (
            <>
              <span>
                This wallet does not have a user account. Create one to tweet.
              </span>
              <CreateAccount createAccount={this.createAccount} />
            </>
          )}
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            margin-top: ${space2X};
          `}
        >
          <div
            css={css`
              display: flex;
              margin-bottom: ${space1X};
              flex-direction: column-reverse;
            `}
          >
            {Object.keys(this.state.store.entities.tweets).map(
              (tweetId: string) => (
                <Tweet
                  followUser={this.followUser}
                  unFollowUser={this.unFollowUser}
                  tweet={this.state.store.entities.tweets[tweetId]}
                  likeTweet={this.likeTweet}
                  key={tweetId}
                  userId={userId}
                  userIsFollowing={this.state.following.indexOf(this.state.store.entities.tweets[tweetId].authorId) !== -1}
                />
              )
            )}
          </div>
        </div>
      </Container>
    )
  }
}

export default App
