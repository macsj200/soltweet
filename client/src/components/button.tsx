import { css, jsx, SerializedStyles } from '@emotion/core'
import React, { SFC, ReactNode } from 'react'
import {
  contentWidth,
  horizontalPageMargin,
  horizontalPageMarginSmall,
  mq,
} from '../css-variables'
import styled from '@emotion/styled'
import { space2X, space1X, spaceHalfX } from '../css-variables'
import { colors } from '..';
/** @jsx jsx */
// WTF emotion?!
jsx
// This component should be used to wrap our content.
// It will keep the content margins consistent throughout the app.

interface IProps {
  onClick?: (event: any) => void
}

const Button: SFC<IProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      css={css`
        margin-top: 0.75rem;
        background: ${colors.blue};
        border: none;
        border-radius: 4px;
        font-size: 1.5rem;
        color: white;
        padding: 0.75rem 0;
        min-width: 120px;
        margin-left: auto;
        margin-right: auto;
        transition: all 100ms ease-in;

        &:hover {
          background: ${colors.lightBlue};
          transition: all 200ms ease-out;
        }
      `}
    >
      {children}
    </button>
  )
}

export default Button
