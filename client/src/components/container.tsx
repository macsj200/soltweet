import { css, jsx } from '@emotion/core'
import React, { SFC } from 'react'
import {
  contentWidth,
  horizontalPageMargin,
  horizontalPageMarginSmall,
  mq,
} from '../css-variables'
import styled from '@emotion/styled'
import { Tweet as TweetType } from '../types/types'
import { space2X, space1X, spaceHalfX } from '../css-variables'
/** @jsx jsx */
// WTF emotion?!
jsx
// This component should be used to wrap our content.
// It will keep the content margins consistent throughout the app.

interface IProps {
  containerStyles?: string
  horizontal?: string
  maxWidth?: string
  mobileHorizontal?: string
  mobileVertical?: string
  vertical?: string
}

const Container: SFC<IProps> = ({
  children,
  containerStyles,
  horizontal = horizontalPageMargin,
  maxWidth = contentWidth,
  mobileHorizontal = horizontalPageMarginSmall,
  mobileVertical = '0',
  vertical = '0',
}) => {
  const Div = styled.div`
    display: block;
    margin: ${space2X} auto;
    max-width: ${maxWidth};
    padding: ${vertical} ${horizontal};
    position: relative;

    @media (max-width: ${mq.tablet}) {
      padding: ${vertical} ${mobileHorizontal};
    }

    @media (max-width: ${mq.mobile}) {
      padding: ${mobileVertical} ${mobileHorizontal};
    }

    ${containerStyles};
  `
  return <Div>{children}</Div>
}

export default Container
