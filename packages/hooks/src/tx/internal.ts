import {
  CosmosQueriesImpl,
  EthereumQueriesImpl,
  IQueriesStore,
  OsmosisQueries,
} from "@keplr-wallet/stores";
import { KeplrETCQueriesImpl } from "@keplr-wallet/stores-etc";

export type QueriesStore = IQueriesStore<
  Partial<OsmosisQueries> & {
    cosmos?: Pick<CosmosQueriesImpl, "queryDelegations">;
    ethereum?: Pick<
      EthereumQueriesImpl,
      "queryEthereumBlockByNumberOrTag" | "queryEthereumCall"
    >;
  } & {
    keplrETC?: Pick<
      KeplrETCQueriesImpl,
      "queryTerraClassicTaxRate" | "queryTerraClassicTaxCaps"
    >;
  }
>;
