import { css, jsx } from '@emotion/core'
import React, { SFC } from 'react'
import { Tweet as TweetType } from '../types/types'
import { space2X, space1X, spaceHalfX } from '../css-variables'
import { colors } from '..'
import Button from './button';
/** @jsx jsx */
// WTF emotion?!
jsx

interface IProps {
  followUser: (userIdToFollow: number) => void
  unFollowUser: (userIdToUnFollow: number) => void
  likeTweet: Function
  tweet: TweetType
}

const Tweet: SFC<IProps> = ({ followUser, unFollowUser, tweet, likeTweet }) => {
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
      <div
        css={css`
          display: flex;
          flex-direction: row;
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
        <Button
          onClick={() => {
            console.log(`follow ${tweet.authorId}`)
            followUser(tweet.authorId)
          }}
        >
          Follow
        </Button>
        <Button
          onClick={() => {
            console.log(`un follow ${tweet.authorId}`)
            unFollowUser(tweet.authorId)
          }}
        >
          Un Follow
        </Button>
      </div>
      <p>{tweet.text}</p>
      <p>Like Count: {tweet.likeCount}</p>
      <p onClick={() => likeTweet(tweet.id)}>Like</p>
    </div>
  )
}

export default Tweet
