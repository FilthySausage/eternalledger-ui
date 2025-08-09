"use client";
import Link from "next/link";
import { WalletButton } from "~~/components/WalletButton";

export default function Home() {
  return (
    <div className="hero min-h-screen" style={{ backgroundImage: "linear-gradient(#dbeafe, #ffffff)" }}>
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold text-primary">LifeChain</h1>
          <p className="py-6">
            Decentralized birth-to-death identity registry with Soul-bound Death Tokens and automated post-mortem actions.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/public" className="btn btn-primary">Public Search</Link>
            <Link href="/verifier" className="btn btn-secondary">Verifier Portal</Link>
            <Link href="/user" className="btn btn-accent">User Dashboard</Link>
          </div>
          <div className="mt-8">
            <WalletButton />
          </div>
        </div>
      </div>
    </div>
  );
}