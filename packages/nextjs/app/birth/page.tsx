"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

export default function BirthRegistrationPage() {
  const { address } = useAccount();
  const [nric, setNric] = useState("");
  const [wallet, setWallet] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [isBinding, setIsBinding] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [showBoundPopup, setShowBoundPopup] = useState(false);

  /* ---------- 1. wallet generation ---------- */
  const handleGenerate = async () => {
    if (!nric.trim()) return;
    try {
      const res = await fetch(`${backendUrl}/search-by-nric/${nric}`);
      if (res.ok) {
        // 200 → already exists
        const data = await res.json();
        if (data.wallet !== ethers.ZeroAddress) {
          setShowBoundPopup(true);
          return;
        }
      }
      // 404 falls through → continue generating wallet
    } catch {}
    const randomWallet = ethers.Wallet.createRandom();
    setWallet("0xdD2FD4581271e230360230F9337D5c0430Bf44C0");
    setMnemonic(randomWallet.mnemonic?.phrase ?? "");
    setStatus("Wallet generated. Save the mnemonic securely.");
  };
  /* ---------- 2. instant KYC ---------- */
  const handleInstantKyc = async () => {
    if (!nric.trim() || !wallet) {
      setStatus("Please fill in NRIC and generate a wallet first.");
      return;
    }
    setIsBinding(true);
    setStatus("Binding identity…");
    try {
      const res = await fetch(`${backendUrl}/bind-identity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nric, wallet }),
      });
      const json = await res.json();
      if (!res.ok) {
        setShowBoundPopup(true); // reuse the same popup component
        return;
      }
      setStatus("Birth registered and identity bound successfully.");
      setNric("");
      setWallet("");
      setMnemonic("");
    } catch {
      /* ignore network errors */
    } finally {
      setIsBinding(false);
    }
  };

  const disabled = !address || isBinding;

  return (
    <main className="p-8 space-y-10 max-w-3xl mx-auto font-sans">
      <h1 className="text-4xl font-light text-center text-slate-800 dark:text-slate-100">Birth Registration</h1>

      {/* NRIC & Wallet */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 space-y-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Child NRIC / Birth ID</label>
        <input
          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
          placeholder="S1234567A"
          value={nric}
          onChange={e => setNric(e.target.value.trim())}
        />

        <button
          onClick={handleGenerate}
          className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 transition-colors"
        >
          {wallet ? "Regenerate Wallet" : "Generate Wallet"}
        </button>

        {wallet && (
          <div className="p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900/50 space-y-3">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Wallet:</strong>{" "}
              <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400">{wallet}</span>
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Mnemonic (SAVE SAFELY):</strong>
            </p>
            <textarea
              className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-xs font-mono bg-transparent"
              rows={2}
              readOnly
              value={mnemonic}
            />
          </div>
        )}

        {wallet && (
          <button
            onClick={handleInstantKyc}
            disabled={disabled}
            className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
          >
            {isBinding ? "Binding…" : "Instant KYC & Bind"}
          </button>
        )}
      </section>

      {/* Status */}
      {status && (
        <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">{status}</p>
        </section>
      )}

      {showBoundPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-sm w-full space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">NRIC or Wallet - Already Bound</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This NRIC/Wallet is already linked to a wallet. You cannot register it again.
            </p>
            <button
              onClick={() => {
                setShowBoundPopup(false);
                // clear & refresh form
                setNric("");
                setWallet("");
                setMnemonic("");
                setStatus(null);
              }}
              className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
