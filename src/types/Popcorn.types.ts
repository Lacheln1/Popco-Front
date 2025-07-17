import { MouseEvent } from "react";

export interface PopcornButtonProps {
  isSelected: boolean;
  onClick: (e: MouseEvent) => void;
  color: "green" | "red";
  label: string;
  iconSrc: string;
}
