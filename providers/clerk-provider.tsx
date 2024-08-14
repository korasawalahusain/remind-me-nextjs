"use client";

import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import React, { PropsWithChildren } from "react";

type Props = {};

export default function Provider({ children }: PropsWithChildren<Props>) {
  const { theme, systemTheme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        ...((theme === "dark" ||
          (theme === "system" && systemTheme === "dark")) && {
          baseTheme: dark,
        }),
      }}
    >
      {children}
    </ClerkProvider>
  );
}
