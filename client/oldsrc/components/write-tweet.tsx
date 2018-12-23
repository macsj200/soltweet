import React, { SFC, ChangeEvent } from 'react'
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
// WTF emotion?!
jsx;

interface IProps {
  handleSubmitTweet: Function
}

class WriteTweet extends React.Component<IProps> {
  state = { tweetText: '' }

  setTweetText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ tweetText: event.target.value })
  }

  submitTweet = () => this.props.handleSubmitTweet({
    author: 'fake-author',
    tweetText: this.state.tweetText
  })

  render() {
    return (
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <textarea
          onChange={this.setTweetText}
          value={this.state.tweetText}
        />
        <button
          css={css`
            margin-top: 0.375rem;
          `}
          onClick={this.submitTweet}
        >Submit</button>
      </div>
    )
  }
}


export default WriteTweet
