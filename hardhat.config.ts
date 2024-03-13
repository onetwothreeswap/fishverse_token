import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
require('hardhat-deploy');

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    matic: {
      url: "https://rpc-mainnet.maticvigil.com",
      chainId: 137,
      gasPrice: 120000000000
    }
  },
  etherscan: {
    apiKey: "YOUR_ETHERSCAN_API_KEY"
  },
  sourcify: {
    enabled: true
  }
};

export default config;
