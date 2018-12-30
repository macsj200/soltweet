import React, { Component } from 'react';
import './App.css';
import Container from './components/container'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core'
import Tweet from './components/tweet';
import WriteTweet from './components/write-tweet';
import { Tweet as TweetType } from './types/types'
import SolTweet from "./contracts/SolTweet.json";
import getWeb3 from "./utils/getWeb3";
import CreateAccount from './components/create-account';
import { space2X, space1X } from './css-variables';
jsx;
/** @jsx jsx */

const H1 = styled.h1`
  text-align: center;
`

interface HandleSubmitTweetArgs {
  author: string
  tweetText: string
}

interface IState {
  tweets: TweetType[],
  web3: any
  accounts: any
  contract: any
  username?: string,
  userId?: number
}

class App extends Component {
  state : IState = {
    tweets: [],
    web3: null,
    accounts: null,
    contract: null
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = (SolTweet as any).networks[networkId];
      // console.log(SolTweet.networks)
      const instance = new web3.eth.Contract(
        SolTweet.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance })
      this.setup()
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  fetchTweets = async () => {
    const { contract, accounts } = this.state
    const numberOfTweets = await contract.methods._getNumberOfTweets().call()
    const tweets: any = []
    for(let i = 0; i < numberOfTweets; i++) {
      // web3.eth.subscribe('LikeCountChange', i)

      tweets.push(await this.fetchTweet(i))
    }
    this.setState({ tweets })
  }

  likeTweet = async (tweetId: string) => {
    const { contract, accounts } = this.state
    await contract.methods._likeTweet(this.state.userId, tweetId).send({ from: accounts[0] })
  }

  fetchTweet = async (tweetId: number) : Promise<TweetType> => {
    const { contract } = this.state
    const tweet = await contract.methods.tweets(tweetId).call()
    const { text, authorId, likes } = tweet
    const author = await contract.methods.users(authorId).call()
    const { username } = author
    return {
      author: username,
      text,
      likeCount: likes,
      id: tweetId.toString()
    }
  }

  setup = async () => {
    const { accounts, contract } = this.state
    this.fetchTweets()
    contract.events.NewTweet({
      filter: {
        userId: [0, 1, 2, 3],
      },
    }, async (err: Error, res?: any) => {
      // console.log(err, res)
      const { tweetId } = res.returnValues
      this.setState({ tweets: [...this.state.tweets, await this.fetchTweet(tweetId)] })
    })
    const userHasAccount = await contract.methods.ownerHasAccount(accounts[0]).call()
    const userId = await contract.methods.ownerToUser(accounts[0]).call()
    if (userHasAccount && userId) {
      try {
        const user = await contract.methods.users(userId).call()
        const { username } = user
        this.setState({
          userId, username
        })
      } catch (err) {
        console.log('no user for address found')
      }
    }
  }

  handleSubmitTweet = async ({
    tweetText
  } : HandleSubmitTweetArgs) => {
    const { accounts, contract, username, userId } = this.state

    await contract.methods._createTweet(userId, tweetText).send({ from: accounts[0] })
  }

  createAccount = async (username: string) => {
    const { accounts, contract } = this.state

    const userId = await contract.methods._createUser(username).send({ from: accounts[0] })

    this.setState({
      username,
      userId
    })
  }

  updateTweets = () => {
    this.fetchTweets()
  }

  render() {
    const { userId, username } = this.state
    return (
      <Container>
        <div>
          <H1>SolTweet</H1>
          {userId ? (
            <span>Logged in as {username}</span>
          ) : (
            <>
              <span>This wallet does not have a user account. Create one to tweet.</span>
              <CreateAccount createAccount={this.createAccount} />
            </>
          )}
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            margin-bottom: ${space2X};
          `}
        >
          <div
            css={css`
              margin-top: ${space2X};
              margin-bottom: ${space1X};
              display: flex;
              flex-direction: column-reverse;
            `}
          >
            {this.state.tweets.map((tweet, idx) => <Tweet tweet={tweet} likeTweet={this.likeTweet} key={idx} />)}
          </div>
          <button
            onClick={this.updateTweets}
            css={css`
              margin-top: 0.75rem;
              background: #6baaf0;
              border: none;
              border-radius: 100px;
              font-size: 1.5rem;
              color: white;
              padding: 0.75rem 0;
              min-width: 120px;
              margin-left: auto;
              margin-right: auto;

              &:hover {
                background: #3771b3;
              }
            `}
          >
            Refresh
          </button>
        </div>
        {userId && <WriteTweet
          handleSubmitTweet={this.handleSubmitTweet}
        />}
      </Container>
    );
  }
}

export default App
