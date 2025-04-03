import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: ReactNode;
  asChild?: boolean;
}

export type ThemeMode = "dark" | "light" | "system";

export interface Theme {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}