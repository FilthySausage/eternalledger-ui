"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import Button from "~~/components/ui/Button";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

export default function BirthRegistrationPage() {
  const { address } = useAccount(); // hospital wallet must be connected
  const [nric, setNric] = useState("");
  const [wallet, setWallet] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [isBinding, setIsBinding] = useState(false);

  /* ---------- 1. DEMO wallet generation ---------- */
  const handleGenerate = () => {
    const randomWallet = ethers.Wallet.createRandom();
    setWallet("0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc");
    setMnemonic(randomWallet.mnemonic?.phrase ?? "");
  };

  /* ---------- 2. Instant KYC (bind IC to wallet) ---------- */
  const handleInstantKyc = async () => {
    if (!nric || !wallet) return alert("Fill NRIC & generate wallet first");
    setIsBinding(true);
    try {
      const res = await fetch(`${backendUrl}/bind-identity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nric, wallet }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Backend error");
      alert("✅ Birth registered & identity bound!");
      // reset form
      setNric("");
      setWallet("");
      setMnemonic("");
    } catch (e: any) {
      alert("❌ " + e.message);
    } finally {
      setIsBinding(false);
    }
  };

  return (
    <main className="p-6 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Birth Registration</h1>

      {/* NRIC */}
      <div className="card bg-base-100 shadow p-6 space-y-4">
        <label className="form-control w-full">
          <span className="label-text font-semibold">Child NRIC / Birth ID</span>
          <input
            className="input input-bordered"
            placeholder="S1234567A"
            value={nric}
            onChange={e => setNric(e.target.value.trim())}
          />
        </label>

        {/* Generate wallet */}
        <Button onClick={handleGenerate} variant="secondary" className="w-full">
          {wallet ? "Regenerate Wallet" : "Generate Wallet"}
        </Button>

        {/* Show keys */}
        {wallet && (
          <div className="p-4 border rounded-md bg-base-200 space-y-2">
            <p>
              <strong>Wallet:</strong> <span className="font-mono text-sm">{wallet}</span>
            </p>
            <p>
              <strong>Mnemonic (SAVE SAFELY):</strong>
            </p>
            <textarea className="textarea textarea-bordered w-full text-xs" rows={2} readOnly value={mnemonic} />
          </div>
        )}

        {/* Instant KYC */}
        {wallet && (
          <Button onClick={handleInstantKyc} disabled={isBinding || !address} variant="primary" className="w-full">
            {isBinding ? "Binding..." : "Instant KYC & Bind"}
          </Button>
        )}
      </div>

      {/* Footer note */}
      <p className="text-center text-sm opacity-60">Hospital wallet must be connected to finalize the binding.</p>
    </main>
  );
}
