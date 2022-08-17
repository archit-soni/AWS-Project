const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic="Enter mnemonic here";
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "Enter path for ropsten network",1)
      },
      network_id: 3
    },
    live: {
      host: "178.25.19.88", // Random IP for example purposes (do not use)
      port: 80,
      network_id: 1,        // Ethereum public network
      // optional config values:
      // gas                  - use gas and gasPrice if creating type 0 transactions
      // gasPrice             - all gas values specified in wei
      // maxFeePerGas         - use maxFeePerGas and maxPriorityFeePerGas if creating type 2 transactions (https://eips.ethereum.org/EIPS/eip-1559)
      // maxPriorityFeePerGas -
      // from - default address to use for any transaction Truffle makes during migrations
      // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
      //          - function that returns a web3 provider instance (see below.)
      //          - if specified, host and port are ignored.
      // production: - set to true if you would like to force a dry run to be performed every time you migrate using this network (default: false)
      //             - during migrations Truffle performs a dry-run if you are deploying to a 'known network'
      // skipDryRun: - set to true if you don't want to test run the migration locally before the actual migration (default: false)
      // confirmations: - number of confirmations to wait between deployments (default: 0)
      // timeoutBlocks: - if a transaction is not mined, keep waiting for this number of blocks (default: 50)
      // deploymentPollingInterval: - duration between checks for completion of deployment transactions
      // networkCheckTimeout: - amount of time for Truffle to wait for a response from the node when testing the provider (in milliseconds)
      //                      - increase this number if you have a slow internet connection to avoid connection errors (default: 5000)
      // disableConfirmationListener: - set to true to disable web3's confirmation listener
    }
  },
  compilers:{
    solc:{
      version:"^0.8.0"
    }
  }
};