// components/FloatingExplorer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

// components/FloatingExplorer.tsx

// components/FloatingExplorer.tsx

// components/FloatingExplorer.tsx

// components/FloatingExplorer.tsx

// components/FloatingExplorer.tsx

// components/FloatingExplorer.tsx

// components/FloatingExplorer.tsx

// components/FloatingExplorer.tsx

// components/FloatingExplorer.tsx

// components/FloatingExplorer.tsx

export default function FloatingExplorer() {
  return (
    <Link
      href="/blockexplorer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Explorer</span>
    </Link>
  );
}
