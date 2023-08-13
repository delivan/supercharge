import { EthereumQueries, IQueriesStore } from "../query";
import { AccountSetBase, AccountSetBaseSuper } from "./base";
import { ChainGetter } from "../chain";
import { AppCurrency, EthSignType } from "@keplr-wallet/types";
import { DenomHelper } from "@keplr-wallet/common";
import { parseEther } from "@ethersproject/units";
import { UnsignedTransaction, serialize } from "@ethersproject/transactions";
import { BigNumber } from "@ethersproject/bignumber";

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
    if (denomHelper.type === "native") {
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

      const value = parseEther(amount).toNumber();
      const to = recipient;
      const gasLimit = 21000;
      const nonce = ethereumNonceQuery.nonce;
      const baseFeePerGas = BigNumber.from(
        ethereumBlockQuery.block?.baseFeePerGas
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
