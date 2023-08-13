import { Bech32Address } from "@keplr-wallet/cosmos";
import { ChainInfo } from "@keplr-wallet/types";

export const EmbedChainInfos: ChainInfo[] = [
  {
    evm: {
      chainId: "420",
      chainName: "Optimism Goerli",
      jsonRpcProvider: "https://goerli.optimism.io",
      nativeCurrency: {
        coinDenom: "ETH",
        coinMinimalDenom: "wei",
        coinDecimals: 18,
        coinImageUrl:
          "https://avatars.githubusercontent.com/u/6250754?s=200&v=4",
      },
    },
    rpc: "https://goerli.optimism.io",
    rest: "https://goerli.optimism.io",
    chainId: "420",
    chainName: "Optimism Goerli",
    stakeCurrency: {
      coinDenom: "ETH",
      coinMinimalDenom: "wei",
      coinDecimals: 18,
      coinImageUrl: "https://avatars.githubusercontent.com/u/6250754?s=200&v=4",
    },
    bip44: {
      coinType: 60,
    },
    bech32Config: Bech32Address.defaultBech32Config("dummy"),
    currencies: [
      {
        coinDenom: "ETH",
        coinMinimalDenom: "wei",
        coinDecimals: 18,
        coinImageUrl:
          "https://avatars.githubusercontent.com/u/6250754?s=200&v=4",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "ETH",
        coinMinimalDenom: "wei",
        coinDecimals: 18,
        coinImageUrl:
          "https://avatars.githubusercontent.com/u/6250754?s=200&v=4",
      },
    ],
    features: ["eth-address-gen", "eth-key-sign"],
  },
  {
    evm: {
      chainId: "10",
      chainName: "Optimism",
      jsonRpcProvider: "https://mainnet.optimism.io",
      nativeCurrency: {
        coinDenom: "ETH",
        coinMinimalDenom: "wei",
        coinDecimals: 18,
        coinImageUrl:
          "https://avatars.githubusercontent.com/u/6250754?s=200&v=4",
        coinGeckoId: "ethereum",
      },
    },
    rpc: "https://mainnet.optimism.io",
    rest: "https://mainnet.optimism.io",
    chainId: "10",
    chainName: "Optimism",
    stakeCurrency: {
      coinDenom: "ETH",
      coinMinimalDenom: "wei",
      coinDecimals: 18,
      coinImageUrl: "https://avatars.githubusercontent.com/u/6250754?s=200&v=4",
      coinGeckoId: "ethereum",
    },
    bip44: {
      coinType: 60,
    },
    bech32Config: Bech32Address.defaultBech32Config("dummy"),
    currencies: [
      {
        coinDenom: "ETH",
        coinMinimalDenom: "wei",
        coinDecimals: 18,
        coinImageUrl:
          "https://avatars.githubusercontent.com/u/6250754?s=200&v=4",
        coinGeckoId: "ethereum",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "ETH",
        coinMinimalDenom: "wei",
        coinDecimals: 18,
        coinImageUrl:
          "https://avatars.githubusercontent.com/u/6250754?s=200&v=4",
        coinGeckoId: "ethereum",
      },
    ],
    features: ["eth-address-gen", "eth-key-sign"],
  },
  {
    evm: {
      chainId: "8453",
      chainName: "Base",
      jsonRpcProvider: "https://mainnet.base.org",
      nativeCurrency: {
        coinDenom: "ETH",
        coinMinimalDenom: "wei",
        coinDecimals: 18,
        coinImageUrl:
          "https://avatars.githubusercontent.com/u/6250754?s=200&v=4",
        coinGeckoId: "ethereum",
      },
    },
    rpc: "https://mainnet.base.org",
    rest: "https://mainnet.base.org",
    chainId: "8453",
    chainName: "Base",
    stakeCurrency: {
      coinDenom: "ETH",
      coinMinimalDenom: "wei",
      coinDecimals: 18,
      coinImageUrl:
        "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp",
      coinGeckoId: "ethereum",
    },
    bip44: {
      coinType: 60,
    },
    bech32Config: Bech32Address.defaultBech32Config("dummy"),
    currencies: [
      {
        coinDenom: "ETH",
        coinMinimalDenom: "wei",
        coinDecimals: 18,
        coinImageUrl:
          "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp",
        coinGeckoId: "ethereum",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "ETH",
        coinMinimalDenom: "wei",
        coinDecimals: 18,
        coinImageUrl:
          "https://avatars.githubusercontent.com/u/6250754?s=200&v=4",
        coinGeckoId: "ethereum",
      },
    ],
    features: ["eth-address-gen", "eth-key-sign"],
  },
];

// The origins that are able to pass any permission that external webpages can have.
export const PrivilegedOrigins: string[] = [
  "https://wallet.keplr.app",
  "https://validator.keplr.app",
  "https://chains.keplr.app",
];

export const CommunityChainInfoRepo = {
  organizationName: "chainapsis",
  repoName: "keplr-chain-registry",
  branchName: "main",
};
