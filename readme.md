# SolTweet source code

## About
SolTweet is a Twitter clone written in [Solidity](https://solidity.readthedocs.io/en/v0.5.1/). Solidity is the language used to write Smart Contracts, or programmable transactions, on the Ethereum network.

# Getting started

- Run tests

  `yarn test`

  `yarn test-frontend`

  `yarn test-truffle`

## Frontend

- `yarn start-frontend` *or* `cd soltweet-frontend; yarn start`

## Backend

### IDE
- We recommend using [VSCode](https://code.visualstudio.com/)
- We use the [solidity](https://marketplace.visualstudio.com/items?itemName=juanblanco.solidity) VSCode extension for linting/development

### Tools
- Install [truffle](https://truffleframework.com/docs/truffle/overview)

`npm install -g truffle`

- [Install compiler version `0.5.0`](https://ethereum.stackexchange.com/a/26485)

`cd /usr/local/lib/node_modules/truffle`

`npm install solc@0.5.0`

- Install [ganache](https://truffleframework.com/ganache)
- Launch ganache and (optionally) specify port (defaults to `7545`)
- (Optional) set port in `truffle.js`
```JavaScript
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
```

## Running/Compiling
- Run unit tests see [debugging w/ truffle cli](https://www.sitepoint.com/debugging-with-truffle-cli/)

  `truffle test`

- Compile (run migration) see [running migrations](https://truffleframework.com/docs/truffle/getting-started/running-migrations)

  `truffle migrate`
