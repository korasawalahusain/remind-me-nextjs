import React, { PropsWithChildren } from "react";

type Props = {};

export default function DashboardLayout({
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="flex w-full h-full flex-col items-center">
      <div className="flex flex-grow w-full justify-center dark:bg-neutral-950">
        <div className="flex flex-col max-w-[920px] px-4 py-12 flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
}
