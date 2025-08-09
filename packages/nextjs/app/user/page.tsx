"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Button from "~~/components/ui/Button";
import MetricCard from "~~/components/ui/MetricCard";
import { useDeathStats } from "~~/hooks/features/useDeathStats";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useRoleStore } from "~~/services/store/roleStore";

export default function UserDashboard() {
  const { address } = useAccount();
  const router = useRouter();
  const { role } = useRoleStore();
  if (role !== "user" && typeof window !== "undefined") {
    router.replace("/login");
  }
  const { totalDeaths } = useDeathStats();
  const [nric, setNric] = useState("");
  const { data: tokenId } = (useScaffoldReadContract as any)({
    contractName: "EternalLedger",
    functionName: "getTokenByNric",
    args: [nric],
  });

  return (
    <main className="p-6 space-y-8 max-w-4xl mx-auto">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="text-sm opacity-70">Wallet: {address ?? "(not connected)"}</p>
      </header>
      <section className="grid md:grid-cols-3 gap-4">
        <MetricCard label="Total Deaths" value={totalDeaths} />
        <MetricCard label="Your Token Id" value={tokenId ? Number(tokenId).toString() : "-"} />
        <MetricCard label="Subscriptions" value={"-"} hint="Feature TBD" />
      </section>
      <section className="card bg-base-100 shadow p-6 flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Check Status</h2>
        <input
          className="input input-bordered"
          placeholder="Your NRIC"
          value={nric}
          onChange={e => setNric(e.target.value)}
        />
        <Button variant="primary" onClick={() => {}}>
          Lookup
        </Button>
        {tokenId && <p className="text-sm">Linked Death Certificate Token: {Number(tokenId)}</p>}
      </section>
    </main>
  );
}
