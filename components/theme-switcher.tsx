"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@ui/tabs";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

type Props = {};

export default function ThemeSwitcher({}: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Tabs defaultValue={theme}>
      <TabsList className="border dark:border-neutral-800 dark:bg-[#030303]">
        <TabsTrigger value="light" onClick={() => setTheme("light")}>
          <SunIcon className="w-[1.2rem] h-[1.2rem]" />
        </TabsTrigger>
        <TabsTrigger value="dark" onClick={() => setTheme("dark")}>
          <MoonIcon className="w-[1.2rem] h-[1.2rem] rotate-90 dark:rotate-0 transition-all" />
        </TabsTrigger>
        <TabsTrigger value="system" onClick={() => setTheme("system")}>
          <DesktopIcon className="w-[1.2rem] h-[1.2rem]" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
