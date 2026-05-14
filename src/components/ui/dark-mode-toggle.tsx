"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function DarkModeToggle(): React.ReactElement {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggle(): void {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  /*
   * Return a static skeleton before mount so server HTML and client first
   * render match exactly. next-themes injects a blocking script that sets
   * the .dark class before React hydrates; any JSX that reads resolvedTheme
   * will differ between SSR (undefined) and client, causing hydration errors.
   */
  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="h-8 w-14 shrink-0 rounded-full border-2 border-[#d2d2d2] bg-[#f8f9fa]"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      data-testid="dark-mode-toggle"
      className={cn(
        "relative flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2",
        isDark
          ? "border-[#3c4043] bg-[#28292d]"
          : "border-[#d2d2d2] bg-[#f8f9fa]",
      )}
    >
      {/* Sun icon (left, visible in light mode) */}
      <span
        className="absolute left-1.5 flex h-4 w-4 items-center justify-center transition-opacity duration-300"
        style={{ opacity: isDark ? 0 : 1 }}
      >
        <Sun size={12} className="text-[#8b6914]" strokeWidth={2.5} />
      </span>

      {/* Moon icon (right, visible in dark mode) */}
      <span
        className="absolute right-1.5 flex h-4 w-4 items-center justify-center transition-opacity duration-300"
        style={{ opacity: isDark ? 1 : 0 }}
      >
        <Moon size={12} className="text-[#8ab4f8]" strokeWidth={2.5} />
      </span>

      {/* Sliding thumb */}
      <span
        className={cn(
          "absolute flex h-5 w-5 items-center justify-center rounded-full shadow-sm transition-all duration-300",
          isDark
            ? "translate-x-7 bg-[#8ab4f8]"
            : "translate-x-0.5 bg-white",
        )}
      >
        {isDark ? (
          <Moon size={10} className="text-[#202124]" strokeWidth={2.5} />
        ) : (
          <Sun size={10} className="text-[#8b6914]" strokeWidth={2.5} />
        )}
      </span>
    </button>
  );
}
