import { EVMQueries, IQueriesStore } from "../query";
import { AccountSetBase, AccountSetBaseSuper } from "./base";
import { ChainGetter } from "../chain";

export interface EVMAccount {
  evm: EVMAccountImpl;
}

export const EVMAccount = {
  use(options: {
    queriesStore: IQueriesStore<EVMQueries>;
  }): (
    base: AccountSetBaseSuper,
    chainGetter: ChainGetter,
    chainId: string
  ) => EVMAccount {
    return (base, chainGetter, chainId) => {
      return {
        evm: new EVMAccountImpl(
          base,
          chainGetter,
          chainId,
          options.queriesStore
        ),
      };
    };
  },
};

export class EVMAccountImpl {
  constructor(
    protected readonly base: AccountSetBase,
    protected readonly chainGetter: ChainGetter,
    protected readonly chainId: string,
    protected readonly queriesStore: IQueriesStore<EVMQueries>
  ) {}
}
