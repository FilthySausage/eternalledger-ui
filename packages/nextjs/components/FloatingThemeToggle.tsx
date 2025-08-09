// components/FloatingThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

// components/FloatingThemeToggle.tsx

// components/FloatingThemeToggle.tsx

// components/FloatingThemeToggle.tsx

// components/FloatingThemeToggle.tsx

// components/FloatingThemeToggle.tsx

// components/FloatingThemeToggle.tsx

// components/FloatingThemeToggle.tsx

// components/FloatingThemeToggle.tsx

// components/FloatingThemeToggle.tsx

// components/FloatingThemeToggle.tsx

export default function FloatingThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
      aria-label="Toggle theme"
    >
      {isDark ? <SunIcon className="w-5 h-5 text-amber-500" /> : <MoonIcon className="w-5 h-5 text-indigo-500" />}
    </button>
  );
}
