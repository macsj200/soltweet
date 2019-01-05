import React, { SFC, ChangeEvent } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Button from './button'
import { space2X, space1X } from '../css-variables'
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
            border-bottom: solid 1px;
            margin-top: ${space1X};
            min-height: 2.5rem;
            resize: vertical;
          `}
          onChange={this.setTweetText}
          value={this.state.tweetText}
        />
        <Button onClick={this.submitTweet}>Submit</Button>
      </div>
    )
  }
}

export default WriteTweet
