import React, { SFC, ChangeEvent } from 'react'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
// WTF emotion?!
jsx

interface IProps {
  createAccount: Function
}

interface IState {
  username: string
}

class CreateAccount extends React.Component<IProps> {
  state: IState = { username: '' }

  setUsername = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ username: event.target.value })
  }

  createAccount = () => this.props.createAccount(this.state.username)

  render() {
    return (
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <textarea onChange={this.setUsername} value={this.state.username} />
        <button
          css={css`
            margin-top: 0.375rem;
          `}
          onClick={this.createAccount}
        >
          Create Account
        </button>
      </div>
    )
  }
}

export default CreateAccount
