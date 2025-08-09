"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Home() {
  /* ------------------------------------------------------------------ */
  const [population] = useState(1000000); // Hardcoded population
  const [deaths, setDeaths] = useState(0);

  async function loadStats() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001"}/total-supply`);
      if (res.ok) {
        const data = await res.json();
        setDeaths(Number(data.totalSupply) || 0);
      }
    } catch {
      /* ignore and keep 0 */
    }
  }

  useEffect(() => {
    loadStats();
  }, []);
  /* ------------------------------------------------------------------ */

  const { isConnected } = useAccount();
  useEffect(() => {
    loadStats(); // re-run when connection changes
  }, [isConnected]);

  /* ---------- Search-status state ---------- */
  const [nric, setNric] = useState("");
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  /* ---------- Lookup ---------- */
  const handleLookup = async () => {
    if (!nric.trim()) return;
    setIsSearching(true);
    setStatus(null);
    setTokenId(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001"}/search-by-nric/${encodeURIComponent(nric)}`,
      );

      if (res.ok) {
        const data = await res.json();
        setTokenId(String(data.tokenId ?? "-"));
        setStatus("Death");
      } else {
        setStatus("Alive");
      }
    } catch {
      setStatus("Alive");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* ---------- Hero ---------- */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-light">
            Eternal Ledger
            <span className="block text-indigo-500 dark:text-indigo-400 font-normal">
              On-chain Life & Legacy Registry
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
            A privacy-aware, soulbound, tamper-proof lifecycle registry from birth to death, built on Polygon and
            Scaffold-ETH 2.
          </p>
        </header>

        {/* ---------- Live counters ---------- */}
        <section className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
          <article className="bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-sm p-6 text-center backdrop-blur">
            <h3 className="text-sm text-slate-500 dark:text-slate-400">Population Registered</h3>
            <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{population.toLocaleString()}</p>
          </article>

          <article className="bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-sm p-6 text-center backdrop-blur">
            <h3 className="text-sm text-slate-500 dark:text-slate-400">Death Certificates</h3>
            <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{deaths.toLocaleString()}</p>
          </article>
        </section>

        {/* ---------- Status Check Card ---------- */}
        <section className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 space-y-5">
          <h2 className="text-xl font-medium text-center text-slate-800 dark:text-slate-100">Check Status</h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Your NRIC"
              value={nric}
              onChange={e => setNric(e.target.value)}
              className="flex-1 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleLookup}
              disabled={isSearching || !nric}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-indigo-200 hover:bg-indigo-400 disabled:opacity-100 transition-colors"
            >
              {"Lookup"}
            </button>
          </div>

          {status && (
            <p className="text-center text-sm">
              Status: <span className={status === "Death" ? "text-red-500" : "text-green-500"}>{status}</span>
            </p>
          )}
        </section>

        {/* ---------- CTA buttons ---------- */}
        <section className="flex justify-center gap-4">
          <Link href="/dashboard">
            <button className="btn btn-primary min-w-[180px]">
              {isConnected ? "My Dashboard" : "Connect & Enter"}
            </button>
          </Link>
          <Link href="/death">
            <button className="btn btn-outline min-w-[180px]">Verify Death</button>
          </Link>
        </section>

        {/* RainbowKit button stays in header on scroll */}
        <div className="fixed top-4 right-4">
          <ConnectButton />
        </div>
      </div>
    </main>
  );
}
