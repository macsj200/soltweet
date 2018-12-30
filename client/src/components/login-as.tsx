import React, { SFC, ChangeEvent } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
// WTF emotion?!
jsx

interface IProps {
  loginAs: Function
}

class LoginAs extends React.Component<IProps> {
  state = { userId: '' }

  setUserId = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ userId: event.target.value })
  }

  loginAs = () => this.props.loginAs(this.state.userId)

  render() {
    return (
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <textarea onChange={this.setUserId} value={this.state.userId} />
        <button
          css={css`
            margin-top: 0.375rem;
          `}
          onClick={this.loginAs}
        >
          Login
        </button>
        <button
          css={css`
            margin-top: 0.375rem;
          `}
          onClick={this.loginAs}
        >
          Create Account
        </button>
      </div>
    )
  }
}

export default LoginAs
