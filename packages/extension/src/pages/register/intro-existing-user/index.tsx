import React, { FunctionComponent } from "react";
import { RegisterSceneBox } from "../components/register-scene-box";
import { Button } from "../../../components/button";
import {
  useSceneEvents,
  useSceneTransition,
} from "../../../components/transition";
import { ColorPalette } from "../../../styles";
import { Subtitle3 } from "../../../components/typography";
import { Gutter } from "../../../components/gutter";
import { useRegisterHeader } from "../components/header";
import { RegisterH4 } from "../components/typography";
import { ArrowDownTrayIcon } from "../../../components/icon";
import { FormattedMessage, useIntl } from "react-intl";
import { useTheme } from "styled-components";

export const RegisterIntroExistingUserScene: FunctionComponent = () => {
  const sceneTransition = useSceneTransition();
  const intl = useIntl();
  const theme = useTheme();

  const header = useRegisterHeader();
  useSceneEvents({
    onWillVisible: () => {
      header.setHeader({
        mode: "welcome",
        title: intl.formatMessage({
          id: "pages.register.intro-existing-user.title",
        }),
        paragraph: intl.formatMessage({
          id: "pages.register.intro-existing-user.paragraph",
        }),
      });
    },
  });

  return (
    <RegisterSceneBox>
      <RegisterH4
        color={
          theme.mode === "light"
            ? ColorPalette["gray-400"]
            : ColorPalette["gray-50"]
        }
      >
        <FormattedMessage id="pages.register.intro-existing-user.recovery-title" />
      </RegisterH4>
      <Gutter size="0.5rem" />
      <Subtitle3 color={ColorPalette["gray-200"]}>
        <FormattedMessage id="pages.register.intro-existing-user.recovery-paragraph" />
      </Subtitle3>

      <Gutter size="1.5rem" />
      <Button
        text={intl.formatMessage({
          id: "pages.register.intro-existing-user.recovery-button",
        })}
        size="large"
        left={<ArrowDownTrayIcon width="1rem" height="1rem" />}
        onClick={() => {
          sceneTransition.push("recover-mnemonic");
        }}
      />
    </RegisterSceneBox>
  );
};
