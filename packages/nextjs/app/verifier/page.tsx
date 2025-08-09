"use client";
import { useState } from "react";
import { BirthForm } from "~~/components/BirthForm";
import { DeathForm } from "~~/components/DeathForm";
import { KpiCard } from "~~/components/KpiCard";

export default function VerifierPortal() {
  const [tab, setTab] = useState<"birth" | "death">("birth");
  const stats = { births: 1247, deaths: 312, pending: 8 };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Verifier Portal</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <KpiCard title="Births" value={stats.births} color="green" />
        <KpiCard title="Deaths" value={stats.deaths} color="red" />
        <KpiCard title="Pending" value={stats.pending} color="amber" />
      </div>

      <div className="tabs tabs-boxed mb-6">
        <button className={`tab ${tab === "birth" ? "tab-active" : ""}`} onClick={() => setTab("birth")}>Birth</button>
        <button className={`tab ${tab === "death" ? "tab-active" : ""}`} onClick={() => setTab("death")}>Death</button>
      </div>

      {tab === "birth" ? <BirthForm /> : <DeathForm />}
    </div>
  );
}