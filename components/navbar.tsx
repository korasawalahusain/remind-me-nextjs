import React from "react";
import Logo from "./logo";
import { UserButton } from "@clerk/nextjs";
import ThemeSwitcher from "./theme-switcher";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="flex w-full h-[60px] items-center justify-between py-4 px-8">
      <Logo />
      <div className="flex gap-4 items-center">
        <UserButton />
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
