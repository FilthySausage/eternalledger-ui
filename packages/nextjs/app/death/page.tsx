"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

export default function DeathRecordPage() {
  /* ---------- state ---------- */
  const { address } = useAccount();
  const [nric, setNric] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [alreadyMinted, setAlreadyMinted] = useState(false);
  const [details, setDetails] = useState({
    fullName: "",
    cause: "",
    location: "",
    deathDate: "",
  });
  const [cid, setCid] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  /* ---------- helpers ---------- */
  const handleCheckNric = async () => {
    if (!nric.trim()) return;
    try {
      const res = await fetch(`${backendUrl}/search-by-nric/${nric}`);
      const data = await res.json();
      if (res.ok && data.wallet !== ethers.ZeroAddress) {
        setIsValid(true);
        setAlreadyMinted(data.isDeceased);
      } else {
        setIsValid(false);
        setAlreadyMinted(false);
      }
    } catch {
      setIsValid(false);
    }
  };

  const handleGetCid = async () => {
    setIsUploading(true);
    const jsonStr = JSON.stringify({ nric, ...details, timestamp: Math.floor(Date.now() / 1000) }, null, 2);
    const jsonFile = new File([jsonStr], `${nric}_death.json`, {
      type: "application/json",
    });
    const form = new FormData();
    form.append("file", jsonFile);

    try {
      const res = await fetch(`${backendUrl}/upload`, { method: "POST", body: form });
      const { cid: newCid } = await res.json();
      setCid(newCid);
    } catch {
      alert("CID fetch failed");
    } finally {
      setIsUploading(false);
    }
  };

  const [txStatus, setTxStatus] = useState<"idle" | "success" | "error">("idle");
  const [txMsg, setTxMsg] = useState("");

  const handleConfirm = async () => {
    if (!cid) return;
    setIsRecording(true);
    setTxStatus("idle");
    setTxMsg("");

    try {
      const res = await fetch(`${backendUrl}/record-death`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nric, metadataCID: cid }),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Unknown error");

      setTxStatus("success");
      setTxMsg(`Success: Soul-bound Token minted!`);
    } catch (e: any) {
      setTxStatus("error");
      // friendly message only
      setTxMsg("Error: Minting failed. The person may already be recorded as deceased.");
    } finally {
      setIsRecording(false);
    }
  };

  const disabled = !address || isRecording;

  return (
    <main className="p-8 space-y-10 max-w-3xl mx-auto font-sans">
      <h1 className="text-4xl font-light text-center text-slate-800 dark:text-slate-100">Record Death & Mint SBT</h1>

      {/* NRIC Check */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 space-y-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">NRIC</label>
        <div className="flex gap-4">
          <input
            className="flex-1 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
            placeholder="S1234567A"
            value={nric}
            onChange={e => {
              setNric(e.target.value);
              setIsValid(null);
            }}
          />
          <button
            onClick={handleCheckNric}
            disabled={disabled || !nric}
            className="px-6 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Check Binding
          </button>
        </div>
        {isValid === false && <p className="text-sm text-red-600 dark:text-red-400">NRIC not registered.</p>}
        {isValid === true && <p className="text-sm text-green-600 dark:text-green-400">NRIC bound to wallet</p>}
      </section>

      {/* Already Minted */}
      {isValid && alreadyMinted && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-4 text-sm text-red-700 dark:text-red-300">
          This person already has a Soul-bound Token. Cannot proceed.
        </div>
      )}

      {/* Death Details */}
      {isValid && !alreadyMinted && (
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-medium text-slate-800 dark:text-slate-100">Death Details</h2>
          <input
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
            placeholder="Full Name"
            value={details.fullName}
            onChange={e => setDetails({ ...details, fullName: e.target.value })}
          />
          <input
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
            placeholder="Cause of Death"
            value={details.cause}
            onChange={e => setDetails({ ...details, cause: e.target.value })}
          />
          <input
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
            placeholder="Location"
            value={details.location}
            onChange={e => setDetails({ ...details, location: e.target.value })}
          />
          <input
            type="date"
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
            value={details.deathDate}
            onChange={e => setDetails({ ...details, deathDate: e.target.value })}
          />
        </section>
      )}

      {/* Get CID */}
      {isValid &&
        !alreadyMinted &&
        details.fullName &&
        details.cause &&
        details.location &&
        details.deathDate &&
        !cid && (
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8">
            <button
              onClick={handleGetCid}
              disabled={isUploading}
              className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50"
            >
              {isUploading ? "Generating CID…" : "Generate CID"}
            </button>
          </section>
        )}

      {/* CID */}
      {cid && (
        <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl shadow-sm p-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">CID</p>
          <p className="text-lg font-mono text-indigo-600 dark:text-indigo-400">{cid}</p>
        </section>
      )}

      {/* Confirm */}
      {cid && (
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 space-y-4">
          {txStatus === "idle" && (
            <button
              onClick={handleConfirm}
              disabled={disabled || isRecording}
              className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
            >
              {isRecording ? "Minting…" : "Confirm & Mint SBT"}
            </button>
          )}

          {/* Success dialogue */}
          {txStatus === "success" && (
            <div className="space-y-4 text-center">
              <p className="text-emerald-700 dark:text-emerald-300 font-medium">{txMsg}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => {
                    setNric("");
                    setDetails({ fullName: "", cause: "", location: "", deathDate: "" });
                    setCid(null);
                    setTxStatus("idle");
                  }}
                  className="px-6 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white text-sm"
                >
                  OK (Reset)
                </button>
              </div>
            </div>
          )}

          {/* Error dialogue */}
          {txStatus === "error" && (
            <div className="text-center">
              <p className="text-red-700 dark:text-red-300 font-medium">{txMsg}</p>
              <button
                onClick={() => setTxStatus("idle")}
                className="mt-4 px-6 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white text-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
