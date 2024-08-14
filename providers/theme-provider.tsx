"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export default function Provider({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </ThemeProvider>
  );
}
