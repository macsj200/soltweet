import { css, jsx } from '@emotion/core'
import React, { SFC } from 'react'
import { Tweet as TweetType } from '../types/types'
import { space2X, space1X, spaceHalfX } from '../css-variables'
import { colors } from '..'
/** @jsx jsx */
// WTF emotion?!
jsx

interface IProps {
  likeTweet: Function
  tweet: TweetType
}

const Tweet: SFC<IProps> = ({ tweet, likeTweet }) => {
  return (
    <div
      css={css`
        background: ${colors.darkestGrey};

        border-top: solid 1px;
        border-bottom: solid 0px;
        /* Reversed column direction */
        &:first-of-type {
          border-bottom: solid 1px;
        }

        padding: ${space1X} ${space2X};
        display: flex;
        flex-direction: column;

        &:hover {
          background: ${colors.darkGrey};
        }

        /* Overrides &:first-of-type */
        && {
          border-color: ${colors.lightGrey};
        }
      `}
    >
      <h3
        css={css`
          margin-bottom: ${spaceHalfX};
          color: ${colors.white};
        `}
      >
        {tweet.author}
      </h3>
      <p>{tweet.text}</p>
      <p>Like Count: {tweet.likeCount}</p>
      <p onClick={() => likeTweet(tweet.id)}>Like</p>
    </div>
  )
}

export default Tweet
