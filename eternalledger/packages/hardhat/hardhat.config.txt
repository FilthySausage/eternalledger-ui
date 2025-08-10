import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { task } from "hardhat/config";
import generateTsAbis from "./scripts/generateTsAbis";

/* ----------  ENV VARS  ---------- */
const providerApiKey   = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
const deployerPk       = process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY
                        ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const etherscanApiKey  = process.env.ETHERSCAN_V2_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

/* ----------  CONFIG  ---------- */
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
    ],
  },
  defaultNetwork: "localhost",
  namedAccounts: { deployer: { default: 0 } },
  networks: {
    /*  ---  ➕  ADDED / UPDATED  --- */
    polygonAmoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPk],
    },

    /*  ---  (rest unchanged)  --- */
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    mainnet:     { url: "https://mainnet.rpc.buidlguidl.com", accounts: [deployerPk] },
    sepolia:     { url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPk] },
    arbitrum:    { url: `https://arb-mainnet.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPk] },
    arbitrumSepolia: { url: `https://arb-sepolia.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPk] },
    optimism:    { url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPk] },
    optimismSepolia: { url: `https://opt-sepolia.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPk] },
    polygon:     { url: `https://polygon-mainnet.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPk] },
    polygonZkEvm: { url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPk] },
    polygonZkEvmCardona: { url: `https://polygonzkevm-cardona.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPk] },
    gnosis:      { url: "https://rpc.gnosischain.com", accounts: [deployerPk] },
    chiado:      { url: "https://rpc.chiadochain.net", accounts: [deployerPk] },
    base:        { url: "https://mainnet.base.org", accounts: [deployerPk] },
    baseSepolia: { url: "https://sepolia.base.org", accounts: [deployerPk] },
    scroll:      { url: "https://rpc.scroll.io", accounts: [deployerPk] },
    scrollSepolia: { url: "https://sepolia-rpc.scroll.io", accounts: [deployerPk] },
    celo:        { url: "https://forno.celo.org", accounts: [deployerPk] },
    celoAlfajores: { url: "https://alfajores-forno.celo-testnet.org", accounts: [deployerPk] },
  },

  /* ----------  VERIFY  ---------- */
  etherscan: { apiKey: etherscanApiKey },
  verify:    { etherscan: { apiKey: etherscanApiKey } },
  sourcify:  { enabled: false },
};

/* ----------  HOOK  ---------- */
task("deploy").setAction(async (args, hre, runSuper) => {
  await runSuper(args);
  await generateTsAbis(hre);
});

export default config;