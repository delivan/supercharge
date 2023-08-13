import { ChainGetter } from "../../chain";
import { computed, makeObservable } from "mobx";
import { QuerySharedContext } from "../../common";
import {
  ObservableChainQueryJSONRPC,
  ObservableChainQueryJSONRPCMap,
} from "../chain-json-rpc-query";

export interface EthereumCallResult {
  result: string;
}

interface TransactionCall {
  from?: string;
  to: string;
  gas?: string;
  gasPrice?: string;
  value?: string;
  data?: string;
}

export class ObservableQueryEthereumCallInner extends ObservableChainQueryJSONRPC<EthereumCallResult> {
  constructor(
    sharedContext: QuerySharedContext,
    chainId: string,
    chainGetter: ChainGetter,
    protected readonly transactionCall: TransactionCall,
    protected readonly blockNumber?: string
  ) {
    super(sharedContext, chainId, chainGetter, "eth_call", [
      transactionCall,
      blockNumber ?? "latest",
    ]);

    makeObservable(this);
  }

  @computed
  get result(): string | undefined {
    if (!this.response) {
      return;
    }

    return this.response.data.result;
  }
}

export class ObservableQueryEthereumCall extends ObservableChainQueryJSONRPCMap<EthereumCallResult> {
  constructor(
    sharedContext: QuerySharedContext,
    chainId: string,
    chainGetter: ChainGetter
  ) {
    super(sharedContext, chainId, chainGetter, (key: string) => {
      const splitedKey = key.split("/");
      return new ObservableQueryEthereumCallInner(
        this.sharedContext,
        this.chainId,
        this.chainGetter,
        JSON.parse(splitedKey[0]),
        splitedKey[1]
      );
    });
  }

  getQueryEthereumCall(
    transactionCall: TransactionCall,
    blockNumber?: string
  ): ObservableQueryEthereumCallInner {
    const key = `${JSON.stringify(transactionCall)}/${blockNumber ?? "latest"}`;
    return this.get(key) as ObservableQueryEthereumCallInner;
  }
}
