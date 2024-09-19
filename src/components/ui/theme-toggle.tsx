"use client";

import * as React from "react";
// import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export function ModeToggle() {
  // const { theme, setTheme } = useTheme();

  // const toggleTheme = () => {
  //   if (theme === "dark") {
  //     setTheme("light");
  //   } else {
  //     setTheme("dark");
  //   }
  // };

  return (
    <Button className="relative rounded-3xl shadow-lg hover:bg-accent hover:rounded-lg transition-all duration-200 h-12 w-12" variant="outline" size="icon" onClick={toggleTheme}>
      <MoonIcon className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <SunIcon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
