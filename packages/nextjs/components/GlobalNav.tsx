"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function GlobalNav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
      <nav className="navbar container mx-auto px-4">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            Eternal Ledger
          </Link>
        </div>

        {/* desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <Link href="/dashboard" className="btn btn-ghost btn-sm">
            User Dashboard
          </Link>
          <Link href="/birth" className="btn btn-ghost btn-sm">
            Birth Registration
          </Link>
          <Link href="/death" className="btn btn-ghost btn-sm">
            Death Verification
          </Link>
          <Link href="/blockexplorer" className="btn btn-ghost btn-sm">
            Explorer
          </Link>
        </div>

        {/* mobile */}
        <div className="dropdown dropdown-end sm:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 shadow bg-base-100 rounded-box w-52">
            <li>
              <Link href="/dashboard">User Dashboard</Link>
            </li>
            <li>
              <Link href="/birth">Birth Registration</Link>
            </li>
            <li>
              <Link href="/death">Death Verification</Link>
            </li>
            <li>
              <Link href="/blockexplorer">Explorer</Link>
            </li>
          </ul>
        </div>

        <div className="ml-4">
          <ConnectButton showBalance={false} />
        </div>
      </nav>
    </header>
  );
}
