import { EthereumQueries, IQueriesStore } from "../query";
import { AccountSetBase, AccountSetBaseSuper } from "./base";
import { ChainGetter } from "../chain";
import { AppCurrency, Coin, EthSignType } from "@keplr-wallet/types";
import { DenomHelper } from "@keplr-wallet/common";
import { parseEther } from "@ethersproject/units";
import { UnsignedTransaction, serialize } from "@ethersproject/transactions";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { isAddress } from "@ethersproject/address";

export interface EthereumAccount {
  ethereum: EthereumAccountImpl;
}

export const EthereumAccount = {
  use(options: {
    queriesStore: IQueriesStore<EthereumQueries>;
  }): (
    base: AccountSetBaseSuper,
    chainGetter: ChainGetter,
    chainId: string
  ) => EthereumAccount {
    return (base, chainGetter, chainId) => {
      return {
        ethereum: new EthereumAccountImpl(
          base,
          chainGetter,
          chainId,
          options.queriesStore
        ),
      };
    };
  },
};

export class EthereumAccountImpl {
  constructor(
    protected readonly base: AccountSetBase,
    protected readonly chainGetter: ChainGetter,
    protected readonly chainId: string,
    protected readonly queriesStore: IQueriesStore<EthereumQueries>
  ) {}

  async makeSendTokenTx(
    amount: string,
    currency: AppCurrency,
    recipient: string
  ): Promise<UnsignedTransaction | undefined> {
    const denomHelper = new DenomHelper(currency.coinMinimalDenom);
    const isValidRecipient = isAddress(recipient);
    if (denomHelper.type === "native" && isValidRecipient) {
      const ethereumQueries = this.queriesStore.get(this.chainId).ethereum;
      const ethereumNonceQuery =
        ethereumQueries.queryEthereumNonce.getQueryEthereumNonce(
          this.base.ethereumHexAddress
        );
      const ethereumBlockQuery =
        ethereumQueries.queryEthereumBlockByNumberOrTag.getQueryByBlockNumberOrTag(
          "pending"
        );

      await ethereumNonceQuery.waitResponse();
      await ethereumBlockQuery.waitResponse();

      const value = parseEther(amount).toString();
      const to = recipient;
      const gasLimit = 21000;
      const nonce = ethereumNonceQuery.nonce;
      const baseFeePerGas = BigNumber.from(
        ethereumBlockQuery.block?.baseFeePerGas ?? 0
      );
      const maxFeePerGas = baseFeePerGas.mul(2);

      const tx: UnsignedTransaction = {
        type: 2,
        value,
        gasLimit,
        maxFeePerGas: maxFeePerGas.toString(),
        maxPriorityFeePerGas: maxFeePerGas.sub(baseFeePerGas).toString(),
        nonce,
        to,
        chainId: Number(this.chainId),
      };

      return tx;
    }

    return;
  }

  async simulateL1DataFee(
    tx?: UnsignedTransaction
  ): Promise<{ gasUsed: number; feeUsed: Coin }> {
    if (!tx) {
      throw new Error("Tx is not provided");
    }

    const ethereumQueries = this.queriesStore.get(this.chainId).ethereum;
    const feeCurrency = this.chainGetter.getChain(this.chainId)
      .feeCurrencies[0];

    if (!ethereumQueries) {
      return {
        gasUsed: BigNumber.from(tx.gasLimit).toNumber(),
        feeUsed: {
          denom: feeCurrency.coinMinimalDenom,
          amount: "0",
        },
      };
    }

    const optimismGasOracleContract = new Contract(
      "0xc0d3C0d3C0d3c0D3C0D3C0d3C0d3C0D3C0D3000f",
      [
        { inputs: [], stateMutability: "nonpayable", type: "constructor" },
        {
          inputs: [],
          name: "DECIMALS",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "baseFee",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [],
          name: "gasPrice",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "bytes", name: "_data", type: "bytes" }],
          name: "getL1Fee",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "bytes", name: "_data", type: "bytes" }],
          name: "getL1GasUsed",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "l1BaseFee",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "overhead",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "scalar",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "version",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
      ]
    );

    const encodedTx = serialize(tx);
    const encodedGetL1FeeFunctionData =
      optimismGasOracleContract.interface.encodeFunctionData("getL1Fee", [
        encodedTx,
      ]);

    const queryGetL1Fee =
      ethereumQueries.queryEthereumCall.getQueryEthereumCall({
        to: optimismGasOracleContract.address,
        data: encodedGetL1FeeFunctionData,
      });
    await queryGetL1Fee.waitResponse();

    return {
      // TODO: add L1 Data gas used
      gasUsed: BigNumber.from(tx.gasLimit).toNumber(),
      feeUsed: {
        denom: feeCurrency.coinMinimalDenom,
        amount: queryGetL1Fee.result
          ? BigNumber.from(queryGetL1Fee.result).toString()
          : "0",
      },
    };
  }

  async sendEthereumTx(unsignedTx: UnsignedTransaction) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const keplr = (await this.base.getKeplr())!;
    const signEthereum = keplr.signEthereum.bind(keplr);
    const signature = await signEthereum(
      this.chainId,
      this.base.ethereumHexAddress,
      JSON.stringify(unsignedTx),
      EthSignType.TRANSACTION
    );

    const rawTransaction = serialize(unsignedTx, signature);

    const sendTx = keplr.sendEthereumTx.bind(keplr);

    const result = await sendTx(this.chainId, rawTransaction);

    return result;
  }
}
