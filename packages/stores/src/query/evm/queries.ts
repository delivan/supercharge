import { QueriesSetBase } from "../queries";
import { ChainGetter } from "../../chain";
import { QuerySharedContext } from "../../common";
import { ObservableQueryEthereumERC20BalanceRegistry } from "./erc20-balance";

export interface EVMQueries {
  evm: EVMQueriesImpl;
}

export const EVMQueries = {
  use(): (
    queriesSetBase: QueriesSetBase,
    sharedContext: QuerySharedContext,
    chainId: string,
    chainGetter: ChainGetter
  ) => EVMQueries {
    return (
      queriesSetBase: QueriesSetBase,
      sharedContext: QuerySharedContext
    ) => {
      return {
        evm: new EVMQueriesImpl(queriesSetBase, sharedContext),
      };
    };
  },
};

export class EVMQueriesImpl {
  constructor(base: QueriesSetBase, sharedContext: QuerySharedContext) {
    base.queryBalances.addBalanceRegistry(
      new ObservableQueryEthereumERC20BalanceRegistry(sharedContext)
    );
  }
}
