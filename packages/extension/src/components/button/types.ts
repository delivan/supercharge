import React, { CSSProperties } from "react";

export type ButtonColor = "primary" | "secondary";
export type ButtonMode = "fill";
export type ButtonType = "button" | "submit" | "reset";
export type ButtonSize =
  | "default"
  | "extraSmall"
  | "small"
  | "medium"
  | "large";

export interface ButtonProps {
  color?: ButtonColor;
  mode?: ButtonMode;
  size?: ButtonSize;
  disabled?: boolean;
  text?: string;
  right?: React.ReactNode;
  onClick?: () => void;

  // Native html element
  type?: ButtonType;

  className?: string;
  style?: CSSProperties;
}