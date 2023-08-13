import { DeepReadonly } from "utility-types";
import { ChainGetter } from "../../chain";
import { QuerySharedContext } from "../../common";
import { QueriesSetBase } from "../queries";
import { ObservableQueryEthereumBalanceRegistry } from "./balance";
import { ObservableQueryEthereumNonce } from "./nonce";
import { ObservableQueryEthereumBlockByNumberOrTag } from "./block";
import { ObservableQueryEthereumCall } from "./call";

export interface EthereumQueries {
  ethereum: EthereumQueriesImpl;
}

export const EthereumQueries = {
  use(): (
    queriesSetBase: QueriesSetBase,
    sharedContext: QuerySharedContext,
    chainId: string,
    chainGetter: ChainGetter
  ) => EthereumQueries {
    return (
      queriesSetBase: QueriesSetBase,
      sharedContext: QuerySharedContext,
      chainId: string,
      chainGetter: ChainGetter
    ) => {
      return {
        ethereum: new EthereumQueriesImpl(
          queriesSetBase,
          sharedContext,
          chainId,
          chainGetter
        ),
      };
    };
  },
};

export class EthereumQueriesImpl {
  public readonly queryEthereumNonce: DeepReadonly<ObservableQueryEthereumNonce>;
  public readonly queryEthereumBlockByNumberOrTag: DeepReadonly<ObservableQueryEthereumBlockByNumberOrTag>;
  public readonly queryEthereumCall: DeepReadonly<ObservableQueryEthereumCall>;

  constructor(
    base: QueriesSetBase,
    sharedContext: QuerySharedContext,
    chainId: string,
    chainGetter: ChainGetter
  ) {
    base.queryBalances.addBalanceRegistry(
      new ObservableQueryEthereumBalanceRegistry(sharedContext)
    );

    this.queryEthereumNonce = new ObservableQueryEthereumNonce(
      sharedContext,
      chainId,
      chainGetter
    );

    this.queryEthereumBlockByNumberOrTag =
      new ObservableQueryEthereumBlockByNumberOrTag(
        sharedContext,
        chainId,
        chainGetter
      );

    this.queryEthereumCall = new ObservableQueryEthereumCall(
      sharedContext,
      chainId,
      chainGetter
    );
  }
}
