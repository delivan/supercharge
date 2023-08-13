import { QueryError, QueryResponse, QuerySharedContext } from "../../common";
import { ChainGetter } from "../../chain";
import { CoinPretty, Int } from "@keplr-wallet/unit";
import { BalanceRegistry, IObservableQueryBalanceImpl } from "../balances";
import { computed, makeObservable } from "mobx";
import { AppCurrency } from "@keplr-wallet/types";
import {
  EthereumCallResult,
  ObservableQueryEthereumCallInner,
} from "../ethereum/call";
import { Contract, ContractInterface } from "@ethersproject/contracts";

export class ObservableQueryEthereumERC20BalanceImplParent extends ObservableQueryEthereumCallInner {
  public duplicatedFetchResolver?: Promise<void>;

  constructor(
    sharedContext: QuerySharedContext,
    chainId: string,
    chainGetter: ChainGetter,
    protected readonly contractAddress: string,
    protected readonly contractABI: ContractInterface,
    protected readonly ethereumAddress: string
  ) {
    const erc20Contract = new Contract(contractAddress, contractABI);
    const encodedBalanceOfFunctionData =
      erc20Contract.interface.encodeFunctionData("balanceOf", [
        ethereumAddress,
      ]);
    const transactionCall = {
      to: contractAddress,
      data: encodedBalanceOfFunctionData,
    };

    super(sharedContext, chainId, chainGetter, transactionCall);

    makeObservable(this);
  }

  protected override canFetch(): boolean {
    // If ethereum address is empty, it will always fail, so don't need to fetch it.
    return this.ethereumAddress.length > 0;
  }
}

export class ObservableQueryEthereumERC20BalanceImpl
  implements IObservableQueryBalanceImpl
{
  constructor(
    protected readonly parent: ObservableQueryEthereumERC20BalanceImplParent,
    protected readonly chainId: string,
    protected readonly chainGetter: ChainGetter,
    protected readonly _currnecy: AppCurrency
  ) {
    makeObservable(this);
  }

  @computed
  get currency(): AppCurrency {
    return this._currnecy;
  }

  @computed
  get balance(): CoinPretty {
    if (!this.response || !this.response.data.result) {
      return new CoinPretty(this.currency, new Int(0)).ready(false);
    }

    return new CoinPretty(
      this.currency,
      new Int(parseInt(this.response.data.result))
    );
  }

  get error(): Readonly<QueryError<unknown>> | undefined {
    return this.parent.error;
  }
  get isFetching(): boolean {
    return this.parent.isFetching;
  }
  get isObserved(): boolean {
    return this.parent.isObserved;
  }
  get isStarted(): boolean {
    return this.parent.isStarted;
  }
  get response(): Readonly<QueryResponse<EthereumCallResult>> | undefined {
    return this.parent.response;
  }

  fetch(): Promise<void> {
    // XXX: The balances of ethereum can share the result of one endpoint.
    //      This class is implemented for this optimization.
    //      But the problem is that the query store can't handle these process properly right now.
    //      Currently, this is the only use-case,
    //      so We'll manually implement this here.
    //      In the case of fetch(), even if it is executed multiple times,
    //      the actual logic should be processed only once.
    //      So some sort of debouncing is needed.
    if (!this.parent.duplicatedFetchResolver) {
      this.parent.duplicatedFetchResolver = new Promise<void>(
        (resolve, reject) => {
          (async () => {
            try {
              await this.parent.fetch();
              this.parent.duplicatedFetchResolver = undefined;
              resolve();
            } catch (e) {
              this.parent.duplicatedFetchResolver = undefined;
              reject(e);
            }
          })();
        }
      );
      return this.parent.duplicatedFetchResolver;
    }

    return this.parent.duplicatedFetchResolver;
  }

  async waitFreshResponse(): Promise<
    Readonly<QueryResponse<unknown>> | undefined
  > {
    return await this.parent.waitFreshResponse();
  }

  async waitResponse(): Promise<Readonly<QueryResponse<unknown>> | undefined> {
    return await this.parent.waitResponse();
  }
}

export class ObservableQueryEthereumERC20BalanceRegistry
  implements BalanceRegistry
{
  protected parentMap: Map<
    string,
    ObservableQueryEthereumERC20BalanceImplParent
  > = new Map();

  constructor(protected readonly sharedContext: QuerySharedContext) {}

  getBalanceImpl(
    chainId: string,
    chainGetter: ChainGetter,
    ethereumAddress: string,
    currency: AppCurrency
  ): ObservableQueryEthereumERC20BalanceImpl | undefined {
    const key = `${chainId}/${ethereumAddress}/evm`;

    if ("contractAddress" in currency && "contractABI" in currency) {
      if (!this.parentMap.has(key)) {
        this.parentMap.set(
          key,
          new ObservableQueryEthereumERC20BalanceImplParent(
            this.sharedContext,
            chainId,
            chainGetter,
            currency.contractAddress,
            currency.contractABI,
            ethereumAddress
          )
        );
      }
    }

    return new ObservableQueryEthereumERC20BalanceImpl(
      this.parentMap.get(key)!,
      chainId,
      chainGetter,
      currency
    );
  }
}
