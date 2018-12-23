import { css } from '@emotion/core'
import React, { SFC } from 'react'
import { Tweet as TweetType } from '../types/types'

interface IProps extends TweetType {
}


const Tweet: SFC<IProps> = ({
  author,
  tweetText
}) => {
  return (
    <div>
      <h1>{tweetText}</h1>
      <h3>{author}</h3>
    </div>
  )
}

export default Tweet
