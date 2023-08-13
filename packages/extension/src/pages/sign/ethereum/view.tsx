import React, { FunctionComponent, useMemo, useState } from "react";
import { SignEthereumInteractionStore } from "@keplr-wallet/stores";
import { Box } from "../../../components/box";
import { XAxis } from "../../../components/axis";
import { Body2, Subtitle3 } from "../../../components/typography";
import { ColorPalette } from "../../../styles";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores";
import { BackButton } from "../../../layouts/header/components";
import { HeaderLayout } from "../../../layouts/header";
import { useInteractionInfo } from "../../../hooks";
import { KeplrError } from "@keplr-wallet/router";
import { ErrModuleLedgerSign } from "../utils/ledger-types";
import { Buffer } from "buffer/";
import { LedgerGuideBox } from "../components/ledger-guide-box";
import { EthSignType } from "@keplr-wallet/types";
import { handleEthereumPreSign } from "../utils/handle-eth-sign";
import { FormattedMessage, useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { FeeControl } from "../../../components/input/fee-control";
import {
  useAmountConfig,
  useFeeConfig,
  useGasConfig,
  useGasSimulator,
  useSenderConfig,
} from "@keplr-wallet/hooks";
import { Stack } from "../../../components/stack";
import { ExtensionKVStore } from "@keplr-wallet/common";

/**
 * CosmosTxView의 주석을 꼭 참고하셈
 * 이 View는 아직 실험적이고 임시로 구현한거임
 * evmos에서 ADR-036 view랑 똑같이 구현해놔서 그게 마음에 안들어서 2.0에서 잠시 뺐다가
 * 쓰는 사람들이 약간 있길래 최소한의 UI로 먼저 구현함
 */
export const EthereumSigningView: FunctionComponent<{
  interactionData: NonNullable<SignEthereumInteractionStore["waitingData"]>;
}> = observer(({ interactionData }) => {
  const {
    chainStore,
    accountStore,
    uiConfigStore,
    signEthereumInteractionStore,
    queriesStore,
  } = useStore();
  const intl = useIntl();
  const theme = useTheme();

  const chainInfo = chainStore.getChain(interactionData.data.chainId);
  const account = accountStore.getAccount(chainInfo.chainId);

  const messageText = useMemo(() => {
    switch (interactionData.data.signType) {
      case EthSignType.MESSAGE:
        return Buffer.from(interactionData.data.message).toString("hex");
      case EthSignType.TRANSACTION:
        return JSON.stringify(
          JSON.parse(Buffer.from(interactionData.data.message).toString()),
          null,
          2
        );
      case EthSignType.EIP712:
        return JSON.stringify(
          JSON.parse(Buffer.from(interactionData.data.message).toString()),
          null,
          2
        );
      default:
        return Buffer.from(interactionData.data.message).toString("hex");
    }
  }, [interactionData.data]);

  const tx = EthSignType.TRANSACTION ? JSON.parse(messageText) : undefined;

  const senderConfig = useSenderConfig(
    chainStore,
    chainInfo.chainId,
    account.ethereumHexAddress
  );
  const amountConfig = useAmountConfig(
    chainStore,
    queriesStore,
    chainInfo.chainId,
    senderConfig
  );
  const gasConfig = useGasConfig(chainStore, chainInfo.chainId, 21000);
  const feeConfig = useFeeConfig(
    chainStore,
    queriesStore,
    chainInfo.chainId,
    senderConfig,
    amountConfig,
    gasConfig
  );

  const interactionInfo = useInteractionInfo(() => {
    signEthereumInteractionStore.rejectAll();
  });

  const [isLedgerInteracting, setIsLedgerInteracting] = useState(false);
  const [ledgerInteractingError, setLedgerInteractingError] = useState<
    Error | undefined
  >(undefined);

  const gasSimulator = useGasSimulator(
    new ExtensionKVStore("gas-simulator.main.send"),
    chainStore,
    chainInfo.chainId,
    gasConfig,
    feeConfig,
    "native",
    () => {
      return {
        simulate: () => account.ethereum.simulateL1DataFee(tx),
      };
    }
  );

  return (
    <HeaderLayout
      title={intl.formatMessage({ id: "page.sign.ethereum.title" })}
      fixedHeight={true}
      left={
        <BackButton
          hidden={
            interactionInfo.interaction && !interactionInfo.interactionInternal
          }
        />
      }
      bottomButton={{
        text: intl.formatMessage({ id: "button.approve" }),
        color: "primary",
        size: "large",
        isLoading:
          signEthereumInteractionStore.isObsoleteInteraction(
            interactionData.id
          ) || isLedgerInteracting,
        onClick: async () => {
          if (interactionData.data.keyType === "ledger") {
            setIsLedgerInteracting(true);
            setLedgerInteractingError(undefined);
          }

          try {
            const signature = await handleEthereumPreSign(
              uiConfigStore.useWebHIDLedger,
              interactionData
            );

            await signEthereumInteractionStore.approveWithProceedNext(
              interactionData.id,
              signature,
              (proceedNext) => {
                if (!proceedNext) {
                  if (
                    interactionInfo.interaction &&
                    !interactionInfo.interactionInternal
                  ) {
                    window.close();
                  }
                }
              }
            );
          } catch (e) {
            console.log(e);

            if (e instanceof KeplrError) {
              if (e.module === ErrModuleLedgerSign) {
                setLedgerInteractingError(e);
              } else {
                setLedgerInteractingError(undefined);
              }
            } else {
              setLedgerInteractingError(undefined);
            }
          } finally {
            setIsLedgerInteracting(false);
          }
        },
      }}
    >
      <Box
        height="100%"
        padding="0.75rem"
        paddingTop="0.5rem"
        paddingBottom="0"
        style={{
          overflow: "auto",
        }}
      >
        <Box
          height="17.5rem"
          padding="1rem"
          backgroundColor={
            theme.mode === "light"
              ? ColorPalette.white
              : ColorPalette["gray-600"]
          }
          borderRadius="0.375rem"
          style={{
            overflow: "auto",
          }}
        >
          <pre
            style={{
              color:
                theme.mode === "light"
                  ? ColorPalette["gray-400"]
                  : ColorPalette["gray-10"],
              // Remove normalized style of pre tag
              margin: 0,
            }}
          >
            {messageText}
          </pre>
        </Box>

        <div style={{ flex: 1 }} />
        <Stack gutter="0.75rem">
          {interactionData.data.signType === EthSignType.TRANSACTION && (
            <FeeControl
              senderConfig={senderConfig}
              feeConfig={feeConfig}
              gasConfig={gasConfig}
              gasSimulator={gasSimulator}
            />
          )}
          <Box
            padding="1rem"
            backgroundColor={
              theme.mode === "light"
                ? ColorPalette.white
                : ColorPalette["gray-600"]
            }
            borderRadius="0.375rem"
          >
            <XAxis alignY="center">
              <Body2
                color={
                  theme.mode === "light"
                    ? ColorPalette["gray-500"]
                    : ColorPalette["gray-200"]
                }
              >
                <FormattedMessage id="page.sign.ethereum.requested-network" />
              </Body2>
              <div style={{ flex: 1 }} />
              <Subtitle3
                color={
                  theme.mode === "light"
                    ? ColorPalette["gray-200"]
                    : ColorPalette["gray-50"]
                }
              >
                {chainStore.getChain(interactionData.data.chainId).chainName}
              </Subtitle3>
            </XAxis>
          </Box>
        </Stack>

        <LedgerGuideBox
          data={{
            keyInsensitive: interactionData.data.keyInsensitive,
            isEthereum: true,
          }}
          isLedgerInteracting={isLedgerInteracting}
          ledgerInteractingError={ledgerInteractingError}
        />
      </Box>
    </HeaderLayout>
  );
});
