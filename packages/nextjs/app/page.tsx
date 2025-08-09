"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Home() {
  /* ------------------------------------------------------------------ */
  /* Dummy numbers – replace with real contract reads later               */
  const population = 12_345;
  const deaths = 432;
  /* ------------------------------------------------------------------ */

  const { isConnected } = useAccount();

  return (
    <>
      {/* ---------- Sticky Nav ---------- */}
      <header className="sticky top-0 z-30 bg-base-100/80 backdrop-blur border-b border-base-300">
        <nav className="navbar container mx-auto px-4">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost normal-case text-xl">
              Eternal Ledger
            </Link>
          </div>

          <div className="flex-none hidden sm:flex items-center gap-2">
            <Link href="/dashboard" className="btn btn-ghost btn-sm">
              User Dashboard
            </Link>
            <Link href="/birth" className="btn btn-ghost btn-sm">
              Birth Registration
            </Link>
            <Link href="/death" className="btn btn-ghost btn-sm">
              Death Verification
            </Link>
          </div>

          {/* Mobile burger */}
          <div className="dropdown dropdown-end sm:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href="/dashboard">User Dashboard</Link>
              </li>
              <li>
                <Link href="/birth">Birth Registration</Link>
              </li>
              <li>
                <Link href="/death">Death Verification</Link>
              </li>
            </ul>
          </div>

          {/* RainbowKit button stays on the right */}
          <div className="ml-4">
            <ConnectButton showBalance={false} />
          </div>
        </nav>
      </header>

      {/* ---------- Hero Section ---------- */}
      <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 text-center gap-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          Eternal Ledger
          <span className="block text-primary">On-chain Life & Legacy Registry</span>
        </h1>

        <p className="max-w-2xl text-base sm:text-lg opacity-80">
          A privacy-aware, soulbound, tamper-proof lifecycle registry from birth to death,
          built on Polygon and Scaffold-ETH 2.
        </p>

        {/* Live counters */}
        <section className="stats stats-vertical md:stats-horizontal bg-base-200/50 shadow my-4">
          <div className="stat">
            <div className="stat-title text-base-content/70">Population Registered</div>
            <div className="stat-value text-primary">{population.toLocaleString()}</div>
            <div className="stat-desc">Identities bound to wallets</div>
          </div>
          <div className="stat">
            <div className="stat-title text-base-content/70">Death Certificates</div>
            <div className="stat-value text-secondary">{deaths.toLocaleString()}</div>
            <div className="stat-desc">EternalLedger SBTs issued</div>
          </div>
        </section>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard">
            <button className="btn btn-primary w-full sm:w-48">
              {isConnected ? "My Dashboard" : "Connect & Enter"}
            </button>
          </Link>
          <Link href="/death">
            <button className="btn btn-outline w-full sm:w-48">Verify Death</button>
          </Link>
        </div>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="text-center py-6 text-xs opacity-60">
        This is a prototype – use at your own risk.
      </footer>
    </>
  );
}