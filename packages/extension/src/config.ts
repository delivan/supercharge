import { Bech32Address } from "@keplr-wallet/cosmos";
import { ChainInfo } from "@keplr-wallet/types";

export const EmbedChainInfos: ChainInfo[] = [
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
    chainSymbolImageUrl:
      "https://avatars.githubusercontent.com/u/58791460?s=200&v=4",
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
    chainSymbolImageUrl:
      "https://raw.githubusercontent.com/base-org/brand-kit/main/logo/in-product/Base_Network_Logo.svg",
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
  {
    evm: {
      chainId: "7777777",
      chainName: "Zora",
      jsonRpcProvider: "https://rpc.zora.energy",
      nativeCurrency: {
        coinDenom: "ETH",
        coinMinimalDenom: "wei",
        coinDecimals: 18,
        coinImageUrl:
          "https://avatars.githubusercontent.com/u/6250754?s=200&v=4",
        coinGeckoId: "ethereum",
      },
    },
    rpc: "https://rpc.zora.energy",
    rest: "https://rpc.zora.energy",
    chainId: "7777777",
    chainName: "Zora",
    chainSymbolImageUrl:
      "https://raw.githubusercontent.com/ourzora/zora-docs/main/static/img/zoraOrb.svg",
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
