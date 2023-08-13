import { ChainGetter } from "../../chain";
import { computed, makeObservable } from "mobx";
import { QuerySharedContext } from "../../common";
import {
  ObservableChainQueryJSONRPC,
  ObservableChainQueryJSONRPCMap,
} from "../chain-json-rpc-query";

interface Transaction {
  accessList?: string[];
  blockHash: string;
  blockNumber: string;
  chainId: string;
  from: string;
  gas: string;
  gasPrice: string;
  hash: string;
  input: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  nonce: string;
  r: string;
  s: string;
  to: string;
  transactionIndex: string;
  type: string;
  v: string;
  value: string;
}

interface Block {
  baseFeePerGas: string;
  difficulty: string;
  extraData: string;
  gasLimit: string;
  gasUsed: string;
  hash: string;
  logsBloom: string;
  mixHash: string;
  nonce: string;
  number: string;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: string;
  stateRoot: string;
  timestamp: string;
  totalDifficulty: string;
  transactions: Transaction[];
  transactionsRoot: string;
  uncles: string[];
}

export interface EthereumBlockByNumberResult {
  result: Block;
}

export class ObservableQueryEthereumBlockByNumberOrTagInner extends ObservableChainQueryJSONRPC<EthereumBlockByNumberResult> {
  constructor(
    sharedContext: QuerySharedContext,
    chainId: string,
    chainGetter: ChainGetter,
    blockNumberOrTagParam: string
  ) {
    super(sharedContext, chainId, chainGetter, "eth_getBlockByNumber", [
      blockNumberOrTagParam,
      true,
    ]);

    makeObservable(this);
  }

  @computed
  get block(): Block | undefined {
    if (!this.response) {
      return;
    }

    return this.response.data.result;
  }
}

export class ObservableQueryEthereumBlockByNumberOrTag extends ObservableChainQueryJSONRPCMap<EthereumBlockByNumberResult> {
  constructor(
    sharedContext: QuerySharedContext,
    chainId: string,
    chainGetter: ChainGetter
  ) {
    super(
      sharedContext,
      chainId,
      chainGetter,
      (blockNumberOrTagParam: string) => {
        return new ObservableQueryEthereumBlockByNumberOrTagInner(
          this.sharedContext,
          this.chainId,
          this.chainGetter,
          blockNumberOrTagParam
        );
      }
    );
  }

  getQueryByBlockNumberOrTag(
    blockNumberOrTag: number | string
  ): ObservableQueryEthereumBlockByNumberOrTagInner {
    const blockNumberOrTagParam =
      typeof blockNumberOrTag === "number"
        ? `0x${Number(blockNumberOrTag).toString(16)}`
        : blockNumberOrTag;

    return this.get(
      blockNumberOrTagParam
    ) as ObservableQueryEthereumBlockByNumberOrTagInner;
  }
}
