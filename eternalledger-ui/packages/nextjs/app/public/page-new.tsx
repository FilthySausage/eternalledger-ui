"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import SearchComponent from "~~/components/SearchComponent";

export default function PublicSearchPage() {
  const [population, setPopulation] = useState(0);
  const [deaths, setDeaths] = useState(0);

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";
  const CONTRACT_ABI = ["function totalBound() view returns (uint256)", "function totalSBT() view returns (uint256)"];

  async function loadStats() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const [bound, sbt] = await Promise.all([contract.totalBound(), contract.totalSBT()]);
      setPopulation(Number(bound));
      setDeaths(Number(sbt));
    } catch {
      // Use mock data if no connection
      setPopulation(12_345);
      setDeaths(432);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-light">
            Public Records Search
            <span className="block text-indigo-500 dark:text-indigo-400 font-normal text-2xl mt-2">
              Eternal Ledger Registry
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
            Search public death records and verify certificates on the blockchain. No login required for basic search
            functionality.
          </p>
        </header>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Link href="/">
            <button className="btn btn-outline">← Back to Home</button>
          </Link>
          <Link href="/login">
            <button className="btn btn-primary">Portal Login</button>
          </Link>
        </div>

        {/* Live counters */}
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

        {/* Public Search */}
        <section className="max-w-2xl mx-auto">
          <SearchComponent role="user" />
        </section>

        {/* Information Cards */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Public Search</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Search for death records by NRIC. Basic status information is publicly available.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Blockchain Verified</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              All records are immutably stored on Polygon blockchain ensuring authenticity and preventing tampering.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Privacy Protected</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Personal information is encrypted and protected. Only authorized parties can access full details.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-4">Need More Access?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            For full features including subscription management, KYC verification, and detailed record access, log in to
            your portal.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <button className="btn btn-primary">Access Portal</button>
            </Link>
          </div>
        </section>

        {/* Wallet Connection */}
        <div className="fixed top-4 right-4">
          <ConnectButton />
        </div>
      </div>
    </main>
  );
}
