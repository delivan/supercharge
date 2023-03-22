import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { ColorPalette } from "../../styles";
import { ButtonProps, ButtonColor, ButtonMode } from "./types";

const makeTextAndSvgColor = (color: string) => {
  return css`
    color: ${color};
    svg {
      fill: ${color};
      stroke: ${color};
    }
  `;
};

const buttonStyleFromColorAndMode: Record<
  ButtonColor,
  Record<ButtonMode, Record<"enabled" | "disabled", FlattenSimpleInterpolation>>
> = {
  primary: {
    fill: {
      enabled: css`
        background-color: ${ColorPalette["blue-400"]};

        ${makeTextAndSvgColor(ColorPalette["white"])}

        :hover {
          ::after {
            background-color: ${ColorPalette["gray-300"]};
            opacity: 0.3;
          }
        }

        :active {
          ::after {
            background-color: ${ColorPalette["gray-300"]};
            opacity: 0.5;
          }
        }
      `,
      disabled: css`
        background-color: ${ColorPalette["blue-400"]};

        ::after {
          background-color: ${ColorPalette["gray-600"]};
          opacity: 0.5;
        }

        ${makeTextAndSvgColor(ColorPalette["white"])}
      `,
    },
  },
  secondary: {
    fill: {
      enabled: css`
        background-color: ${ColorPalette["gray-400"]};

        ${makeTextAndSvgColor(ColorPalette["white"])}

        :hover {
          ::after {
            background-color: ${ColorPalette["gray-300"]};
            opacity: 0.2;
          }
        }

        :active {
          ::after {
            background-color: ${ColorPalette["gray-300"]};
            opacity: 0.4;
          }
        }
      `,

      disabled: css`
        background-color: ${ColorPalette["gray-400"]};

        ::after {
          background-color: ${ColorPalette["gray-600"]};
          opacity: 0.5;
        }

        ${makeTextAndSvgColor(ColorPalette["white"])}
      `,
    },
  },
};

export const Styles = {
  Container: styled.div<Pick<ButtonProps, "mode">>`
    // Used for making button fill parent horizontally.

    display: flex;
    flex-direction: column;
    align-items: center;
  `,

  // "onClick" field should be omitted because "onClick" prop already exists on html button component.
  // If not omitted, they are intersected with each other.
  Button: styled.button<Omit<ButtonProps, "onClick">>`
    width: 100%;
    height: ${({ size }) => {
      switch (size) {
        case "extraSmall":
          return "2rem";
        case "small":
          return "2.25rem";
        case "large":
          return "3rem";
        default:
          return "2.75rem";
      }
    }};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    overflow: hidden;

    // Default font style.
    // Override these in "buttonStyleFromColorAndMode" if needed.
    font-weight: 600;
    font-size: ${({ size }) => {
      switch (size) {
        case "large":
          return "1rem";
        default:
          return "0.875rem";
      }
    }};
    letter-spacing: 0.2px;

    white-space: nowrap;

    // Remove normalized css properties.
    border-width: 0;
    border-style: none;
    border-color: transparent;
    border-image: none;
    padding: 0 0.75rem;

    // For hovering.
    position: relative;
    ::after {
      content: "";

      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    ${({ color, mode, disabled }) =>
      buttonStyleFromColorAndMode[color || "primary"][mode || "fill"][
        disabled ? "disabled" : "enabled"
      ]}
  `,
  Right: styled.span`
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: 0.25rem;
  `,
};