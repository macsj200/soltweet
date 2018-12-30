import React, { SFC, ChangeEvent } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
// WTF emotion?!
jsx

interface IProps {
  handleSubmitTweet: Function
}

class WriteTweet extends React.Component<IProps> {
  state = { tweetText: '' }

  setTweetText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ tweetText: event.target.value })
  }

  submitTweet = () =>
    this.props.handleSubmitTweet({
      tweetText: this.state.tweetText,
    })

  render() {
    return (
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <h3>Write a tweet</h3>
        <textarea
          css={css`
            border: none;
            resize: vertical;
            min-height: 2.5rem;
            border-bottom: solid 1px;
          `}
          onChange={this.setTweetText}
          value={this.state.tweetText}
        />
        <button
          css={css`
            margin-top: 0.75rem;
            background: #6baaf0;
            border: none;
            border-radius: 100px;
            font-size: 2rem;
            color: white;
            padding: 0.75rem 0;
            min-width: 200px;
            margin-left: auto;

            &:hover {
              background: #3771b3;
            }
          `}
          onClick={this.submitTweet}
        >
          Submit
        </button>
      </div>
    )
  }
}

export default WriteTweet
