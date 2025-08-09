"use client";

import Link from "next/link";
import Button from "~~/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center gap-10">
      <section className="max-w-3xl flex flex-col gap-6">
        <h1 className="text-5xl font-extrabold leading-tight">
          Eternal Ledger
          <span className="block text-primary">On‑chain Life & Legacy Registry</span>
        </h1>
        <p className="text-lg opacity-80">
          A privacy‑aware soulbound token system binding real‑world identities to immutable, non‑transferable
          certificates. Hospitals record events. Users verify status. Auditable, censorship‑resistant, transparent.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="w-full sm:w-48">
            <Button variant="primary">Enter Portal</Button>
          </Link>
          <Link href="/blockexplorer" className="w-full sm:w-48">
            <Button variant="secondary">Block Explorer</Button>
          </Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3 w-full max-w-5xl px-4">
        <div className="card bg-base-100 shadow p-5">
          <h3 className="font-semibold mb-2">Identity Binding</h3>
          <p className="text-sm opacity-70">Hospitals bind NRIC → wallet; prevents duplicate or spoofed records.</p>
        </div>
        <div className="card bg-base-100 shadow p-5">
          <h3 className="font-semibold mb-2">Soulbound Certificates</h3>
          <p className="text-sm opacity-70">Non‑transferable ERC‑721 (EIP‑5192) tokens for verifiable death records.</p>
        </div>
        <div className="card bg-base-100 shadow p-5">
          <h3 className="font-semibold mb-2">Public Transparency</h3>
          <p className="text-sm opacity-70">Anyone can query aggregated statistics & token metadata via IPFS.</p>
        </div>
      </section>
      <footer className="text-xs opacity-60">This is a prototype interface. Connect & proceed at your own risk.</footer>
    </main>
  );
}
