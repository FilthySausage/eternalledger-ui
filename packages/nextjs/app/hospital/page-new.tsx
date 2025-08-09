"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import SearchComponent from "~~/components/SearchComponent";
import WalletRegistration from "~~/components/WalletRegistration";
import Button from "~~/components/ui/Button";
import MetricCard from "~~/components/ui/MetricCard";
import { useDeathStats } from "~~/hooks/features/useDeathStats";
import { useRegistry } from "~~/hooks/features/useRegistry";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useRoleStore } from "~~/services/store/roleStore";

export default function HospitalDashboard() {
  const router = useRouter();
  const { role } = useRoleStore();
  const { address } = useAccount();
  const { totalDeaths } = useDeathStats();
  const { records, isLoading } = useRegistry();

  const [activeTab, setActiveTab] = useState<"search" | "register">("search");

  const { data: isRegistrar } = useScaffoldReadContract({
    contractName: "EternalLedger",
    functionName: "authorizedRegistrars",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  useEffect(() => {
    if (role !== "hospital" && typeof window !== "undefined") {
      router.replace("/login");
    }
  }, [role, router]);

  // Mock population data
  const populationCount = 12_345;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light">Hospital Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-300">Medical records and patient management portal</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/login")}>
              Switch Portal
            </Button>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 rounded-lg p-4 backdrop-blur">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Hospital Wallet:</strong> {address ?? "(not connected)"}
            </p>
            {isRegistrar === false && (
              <div className="mt-2 px-3 py-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⚠️ Your wallet is not an authorized registrar. Contact admin for permissions.
                </p>
              </div>
            )}
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid md:grid-cols-4 gap-6">
          <MetricCard label="Total Population" value={populationCount.toLocaleString()} />
          <MetricCard label="Death Certificates" value={totalDeaths} />
          <MetricCard
            label="Registered Records"
            value={records.length}
            hint={isLoading ? "Loading..." : "Hospital records"}
          />
          <MetricCard
            label="Access Level"
            value={isRegistrar ? "Authorized" : "Limited"}
            hint={isRegistrar ? "Full access" : "View only"}
          />
        </section>

        {/* Action Tabs */}
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("search")}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "search"
                    ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search & View Records
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "register"
                    ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Register New Patient
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "search" && (
              <div className="space-y-6">
                <SearchComponent role="hospital" />

                {/* Additional Hospital Tools */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/upload")}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Record Death Certificate
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/birth")}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Register Birth Certificate
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "register" && (
              <div>
                {isRegistrar ? (
                  <WalletRegistration
                    onSuccess={() => {
                      // Refresh data or show success message
                    }}
                  />
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Access Restricted</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                      Only authorized hospital registrars can register new patients. Contact your administrator to
                      request registration permissions.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Recent Records Table */}
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Records</h3>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-sm text-slate-500">Loading records...</p>
            </div>
          ) : records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-medium">Token ID</th>
                    <th className="text-left py-3 px-4 font-medium">Metadata CID</th>
                    <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 5).map((record, index) => (
                    <tr key={index} className="border-b border-slate-100 dark:border-slate-700">
                      <td className="py-3 px-4">#{record.tokenId || index + 1}</td>
                      <td className="py-3 px-4 font-mono text-xs">{record.metadataCID || "QmExample..."}</td>
                      <td className="py-3 px-4">
                        {record.timestamp ? new Date(record.timestamp * 1000).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={`https://ipfs.io/ipfs/${record.metadataCID || "QmExample"}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs"
                        >
                          View IPFS →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No records found</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
