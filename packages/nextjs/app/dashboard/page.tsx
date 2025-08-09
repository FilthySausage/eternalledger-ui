"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

  /* mock eKYC state */
  const [ekycDone, setEkycDone] = useState(false);

  /* mock search state */
  const [ic, setIc] = useState("");
  const [searchResult, setSearchResult] = useState<"alive" | "deceased" | null>(null);

  /* mock subscriptions */
  const subscriptions = ["Netflix", "Spotify", "iCloud+", "Disney+"];
  const [subs] = useState(subscriptions);

  /* ------------- handlers ------------- */
  const handleSearch = () => {
    if (!ic.trim()) return;
    /* later: call contract to get CID & status */
    setSearchResult(Math.random() > 0.5 ? "alive" : "deceased");
  };

  const handleEkyc = () => {
    /* later: open modal / sign message / mint identity NFT */
    setEkycDone(true);
  };

  const [population] = useState(1000000);
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

  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-4">
        {" "}
        {
          <main className="container mx-auto px-4 py-8 space-y-8">
            {/* ---------- Top stats banner ---------- */}
            <section className="stats stats-vertical md:stats-horizontal shadow w-full bg-gradient-to-r from-primary/10 via-base-200 to-secondary/10 rounded-box">
              <div className="stat place-items-center">
                <div className="stat-title text-base-content/70">Population Registered</div>
                <div className="stat-value text-primary">{population.toLocaleString()}</div>
              </div>
              <div className="stat place-items-center">
                <div className="stat-title text-base-content/70">Death Certificates</div>
                <div className="stat-value text-secondary">{deaths.toLocaleString()}</div>
              </div>
            </section>

            {/* ---------- Lower split section ---------- */}
            <section className="grid md:grid-cols-2 gap-6">
              {/* ---- Left: eKYC ---- */}
              <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="card-title mb-4">Self Identity (eKYC)</h2>
                {!ekycDone ? (
                  <Link
                    href={isConnected ? "/ekyc" : "#"}
                    onClick={e => {
                      if (!isConnected) e.preventDefault(); // stay on page if wallet not connected
                    }}
                  >
                    <p className="text-sm opacity-70 mb-4">
                      Prove you’re alive and bind this wallet to your identity once and for all.
                    </p>
                    <button className="btn btn-primary w-full" disabled={!isConnected}>
                      {isConnected ? "Start eKYC" : "Connect wallet first"}
                    </button>
                  </Link>
                ) : (
                  <div className="alert alert-success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>eKYC verified – identity bound to wallet.</span>
                  </div>
                )}
              </div>

              {/* ---- Right: Subscriptions ---- */}
              <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="card-title mb-4">Linked Subscriptions</h2>
                {subs.length ? (
                  <div className="flex flex-wrap gap-2">
                    {subs.map(s => (
                      <span key={s} className="badge badge-lg badge-outline text-primary-content bg-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm opacity-70">No subscriptions linked yet. Complete eKYC to attach them.</p>
                )}
              </div>
            </section>
          </main>
        }{" "}
      </div>
    </>
  );
}
