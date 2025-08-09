"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Button from "~~/components/ui/Button";
import MetricCard from "~~/components/ui/MetricCard";
import { useDeathStats } from "~~/hooks/features/useDeathStats";
import { useRegistry } from "~~/hooks/features/useRegistry";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useRoleStore } from "~~/services/store/roleStore";

export default function HospitalDashboard() {
  const router = useRouter();
  const { role } = useRoleStore();
  if (role !== "hospital" && typeof window !== "undefined") {
    router.replace("/login");
  }
  const { address } = useAccount();
  const { totalDeaths } = useDeathStats();
  const { records, isLoading } = useRegistry();
  const [nric, setNric] = useState("");
  const [wallet, setWallet] = useState("");

  const { data: isRegistrar } = (useScaffoldReadContract as any)({
    contractName: "EternalLedger",
    functionName: "authorizedRegistrars",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  const { writeContractAsync } = (useScaffoldWriteContract as any)({
    contractName: "EternalLedger",
    functionName: "bindIdentity",
    args: [nric, wallet as `0x${string}`],
  });

  const handleBind = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nric || !wallet) return;
    try {
      await writeContractAsync({ args: [nric, wallet] });
      setNric("");
      setWallet("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="p-6 space-y-8 max-w-5xl mx-auto">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Hospital Dashboard</h1>
        <p className="text-sm opacity-70">Wallet: {address ?? "(not connected)"}</p>
        {isRegistrar === false && (
          <div className="alert alert-warning py-2">Your wallet is not an authorized registrar.</div>
        )}
      </header>
      <section className="grid md:grid-cols-3 gap-4">
        <MetricCard label="Total Deaths" value={totalDeaths} />
        <MetricCard label="Registered Records" value={records.length} />
        <MetricCard label="Population" value={"-"} hint="Not tracked on-chain yet" />
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        <form onSubmit={handleBind} className="card bg-base-100 shadow p-6 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Bind Identity</h2>
          <input
            className="input input-bordered"
            placeholder="NRIC"
            value={nric}
            onChange={e => setNric(e.target.value)}
          />
          <input
            className="input input-bordered"
            placeholder="Wallet 0x..."
            value={wallet}
            onChange={e => setWallet(e.target.value)}
          />
          <Button type="submit" disabled={!isRegistrar} variant="primary">
            Bind
          </Button>
          {!isRegistrar && <p className="text-xs text-warning">Only registrars can bind identities.</p>}
        </form>
        <div className="card bg-base-100 shadow p-6 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Search / Actions</h2>
          <p className="text-sm opacity-70">More hospital tools (new birth / new death) can be added here.</p>
          <Button variant="secondary" onClick={() => router.push("/upload")}>
            Record Death
          </Button>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Records</h2>
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Metadata CID</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              )}
              {!isLoading && records.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No records
                  </td>
                </tr>
              )}
              {records
                .slice(-10)
                .reverse()
                .map(r => (
                  <tr key={r.tokenId} className="hover">
                    <td>{r.tokenId}</td>
                    <td>{r.metadataCID}</td>
                    <td>{r.timestamp ? new Date(r.timestamp * 1000).toLocaleDateString() : ""}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
