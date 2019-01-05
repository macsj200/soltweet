import React, { Component } from 'react'
import { normalize } from 'normalizr';
import { tweetSchema } from './schemas';
import './App.css'
import Container from './components/container'
import styled from '@emotion/styled'
import { jsx, css, Global } from '@emotion/core'
import Tweet from './components/tweet'
import WriteTweet from './components/write-tweet'
import { Tweet as TweetType } from './types/types'
import SolTweet from './contracts/SolTweet.json'
import getWeb3 from './utils/getWeb3'
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
  contract: any
  username?: string
  userId?: number,
  store: {
    result: string[],
    entities: {
      tweets: {
        [key: string]: any
      }
    }
  }
}

class App extends Component {
  state: IState = {
    tweets: [],
    web3: null,
    accounts: null,
    contract: null,
    store: {
      result: [],
      entities: {
        tweets: {}
      }
    }
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()

      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = (SolTweet as any).networks[networkId]
      // console.log(SolTweet.networks)
      const instance = new web3.eth.Contract(
        SolTweet.abi,
        deployedNetwork && deployedNetwork.address
        // '0x47267648c32753395f8d1dbfdc0ffbc86b3433a4'
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance })
      this.setup()
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.error(error)
    }
  }

  fetchTweets = async () => {
    const { contract, accounts, web3 } = this.state
    const numberOfTweets = await contract.methods._getNumberOfTweets().call()
    for (let i = 0; i < numberOfTweets; i++) {
      await this.fetchTweet(i)
    }
  }

  likeTweet = async (tweetId: string) => {
    const { contract, accounts } = this.state
    await contract.methods
      ._likeTweet(this.state.userId, tweetId)
      .send({ from: accounts[0] })
  }

  fetchTweet = async (tweetId: number) => {
    const { contract } = this.state
    const tweet = await contract.methods.tweets(tweetId).call()
    const { text, authorId, likes } = tweet
    const author = await contract.methods.users(authorId).call()
    const { username } = author
    contract.events.LikeCountChange(
      {
        filter: {
          tweetId: tweetId.toString()
        },
      },
      async (err: Error, res?: any) => {
        console.log(err, res);
        const { tweetId, likeCount } = res.returnValues
        const { store } = this.state;
        const tweet = store.entities.tweets[tweetId];
        tweet.likeCount = likeCount;
        this.setState({store: {...store}});
      } 
    );

    
    const { store } = this.state;
    const normalized = normalize({
      author: username,
      text,
      likeCount: likes,
      id: tweetId.toString(),
    }, tweetSchema);
    store.entities.tweets = {...store.entities.tweets, ...normalized.entities.tweets};
    this.setState({store: store});
  }

  computeFollowing = async (userId: string): Promise<string[]> => {
    const { accounts, contract } = this.state
    const keys = await contract.methods._getFollowingMappingKeys(userId).call()
    let result: string[] = []
    for(let followingUserId of keys) {
      const isFollowing = await contract.methods.followingMapping(userId, followingUserId).call()
      if (isFollowing) {
        result = [...result, followingUserId]
      }
    }
    result.push(userId);
    return result
  }

  setup = async () => {
    const { accounts, contract } = this.state
    this.fetchTweets()
    const userHasAccount = await contract.methods
      .ownerHasAccount(accounts[0])
      .call()
    const userId = await contract.methods.ownerToUser(accounts[0]).call()
    if (userHasAccount && userId) {
      try {
        const user = await contract.methods.users(userId).call()
        const { username } = user
        this.setState({
          userId,
          username,
        })
      } catch (err) {
        console.log('no user for address found')
      }
    }
    // await contract.methods
      /*
        Follow yourself
        TODO remove this from prod, for testing purposes only
      */
      // ._follow(userId, userId)
      // .send({ from: accounts[0] })
    const following: string[] = await this.computeFollowing(userId)
    contract.events.NewTweet(
      {
        filter: {
          userId: following,
        },
      },
      async (err: Error, res?: any) => {
        console.log(err, res)
        const { tweetId } = res.returnValues
        this.setState({
          tweets: [...this.state.tweets, await this.fetchTweet(tweetId)],
        })
      }
    )
  }

  handleSubmitTweet = async ({ tweetText }: HandleSubmitTweetArgs) => {
    const { accounts, contract, username, userId } = this.state

    await contract.methods
      ._createTweet(userId, tweetText)
      .send({ from: accounts[0] })
  }

  createAccount = async (username: string) => {
    const { accounts, contract } = this.state

    await contract.methods
      ._createUser(username)
      .send({ from: accounts[0] });

    const userId = await contract.methods.ownerToUser(accounts[0]).call()

    this.setState({
      username,
      userId,
    })
  }

  updateTweets = () => {
    this.fetchTweets()
  }

  render() {
    const { userId, username } = this.state
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
            {Object.keys(this.state.store.entities.tweets).map((tweetId: string) => (
              <Tweet tweet={this.state.store.entities.tweets[tweetId]} likeTweet={this.likeTweet} key={tweetId} />
            ))}
          </div>
          <Button onClick={this.updateTweets}>Refresh</Button>
        </div>
      </Container>
    )
  }
}

export default App
