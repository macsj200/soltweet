import React, { Component } from 'react';
import './App.css';
import Container from './components/container'
import styled from '@emotion/styled'
import { jsx } from '@emotion/core'
import Tweet from './components/tweet';
import WriteTweet from './components/write-tweet';
import { Tweet as TweetType } from './types/types'

const H1 = styled.h1`
  text-align: center;
`

interface HandleSubmitTweetArgs {
  author: string
  tweetText: string
}

interface IState {
  tweets: TweetType[]
}

class App extends Component {
  state : IState = {
    tweets: [
      {
        author: 'fake-author-1',
        tweetText: 'fake-text-1'
      },
      {
        author: 'fake-author-2',
        tweetText: 'fake-text-2'
      }
    ]
  }

  handleSubmitTweet = ({
    author,
    tweetText
  } : HandleSubmitTweetArgs) => {
    const tweet = {
      author,
      tweetText
    }
    this.setState({
      tweets: [tweet, ...this.state.tweets]
    })
  }

  render() {
    return (
      <Container>
        <div>
          <H1>SolTweet</H1>
        </div>
        <div>
          {this.state.tweets.map((tweet, idx) => <Tweet {...tweet} key={idx} />)}
        </div>
        <WriteTweet
          handleSubmitTweet={this.handleSubmitTweet}
        />
      </Container>
    );
  }
}

export default App
