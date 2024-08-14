import { ClerkProvider } from "@clerk/nextjs";
import React, { PropsWithChildren } from "react";

type Props = {};

export default function Provider({ children }: PropsWithChildren<Props>) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
