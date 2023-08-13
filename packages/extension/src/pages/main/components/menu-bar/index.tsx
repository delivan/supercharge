import React, { FunctionComponent } from "react";
import styled, { useTheme } from "styled-components";
import { ColorPalette } from "../../../../styles";
import { CloseIcon } from "../../../../components/icon";
import { Box } from "../../../../components/box";
import { Gutter } from "../../../../components/gutter";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../stores";
import { H3 } from "../../../../components/typography";
import { Bleed } from "../../../../components/bleed";
import { FormattedMessage } from "react-intl";

const Styles = {
  MenuItem: styled(H3)`
    color: ${(props) =>
      props.theme.mode === "light"
        ? ColorPalette["gray-700"]
        : ColorPalette["white"]};

    cursor: pointer;
  `,
  Flex1: styled.div`
    flex: 1;
  `,
};

export const MenuBar: FunctionComponent<{
  close: () => void;
}> = observer(({ close }) => {
  const { analyticsStore, keyRingStore } = useStore();

  const theme = useTheme();

  return (
    <Box
      height="100%"
      width="fit-content"
      alignX="left"
      backgroundColor={
        theme.mode === "light" ? ColorPalette.white : ColorPalette["gray-600"]
      }
      paddingTop="1.125rem"
      paddingX="1.75rem"
      paddingBottom="1.25rem"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Bleed horizontal="0.15rem">
        {/*
            좀 이상한 구조지만 clickable area를 조절하고
            아이콘이 약간 오른쪽으로 치우져보이는 느낌을 없애기 위해서
            어쩔 수 없이 약간 복잡해짐
           */}
        <Box alignX="left">
          <Box onClick={close} cursor="pointer">
            <CloseIcon
              width="1.5rem"
              height="1.5rem"
              color={
                theme.mode === "light"
                  ? ColorPalette["gray-200"]
                  : ColorPalette["gray-50"]
              }
            />
          </Box>
        </Box>
      </Bleed>
      <Gutter size="1.25rem" />

      <Styles.MenuItem
        onClick={(e) => {
          e.preventDefault();

          if (keyRingStore.selectedKeyInfo) {
            analyticsStore.logEvent("click_menu_manageChainVisibility");
            browser.tabs
              .create({
                url: `/register.html#?route=enable-chains&vaultId=${keyRingStore.selectedKeyInfo.id}&skipWelcome=true`,
              })
              .then(() => {
                window.close();
              });
          }
        }}
      >
        <FormattedMessage id="page.main.components.menu-bar.manage-chain-visibility-title" />
      </Styles.MenuItem>
    </Box>
  );
});
