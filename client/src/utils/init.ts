import getWeb3 from './getWeb3'
import App from '../App';

interface IArgs {
  compiledContract: any
  contractAddress?: string
}

export async function init(this: App, {
  compiledContract,
  contractAddress,
} : IArgs) {
  try {
    // Get network provider and web3 instance.
    const web3 = await getWeb3()

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts()

    // Get the contract instance.
    const networkId = await web3.eth.net.getId()
    const deployedNetwork = (compiledContract as any).networks[networkId]

    const deployedAddress = contractAddress ? contractAddress : deployedNetwork && deployedNetwork.address

    const instance = new web3.eth.Contract(
      compiledContract.abi,
      deployedAddress
      // '0x47267648c32753395f8d1dbfdc0ffbc86b3433a4'
    )

    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    this.setState({ web3, accounts, contract: instance })
    this.setup()
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract Check console for details.`
    )
    console.error(error)
  }
}