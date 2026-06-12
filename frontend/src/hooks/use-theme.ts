"use client";

import { useTheme } from "next-themes";

export function useThemeToggle() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = resolvedTheme === "dark";
  const isLight = resolvedTheme === "light";
  const isSystem = theme === "system";

  return {
    theme,
    setTheme,
    systemTheme,
    resolvedTheme,
    toggleTheme,
    isDark,
    isLight,
    isSystem,
  };
}
