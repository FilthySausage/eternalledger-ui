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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hospital Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                Medical records and patient management portal
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push("/login")} className="shrink-0">
              Switch Portal
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="bg-slate-50/80 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
              <p className="text-sm text-slate-600 dark:text-slate-400 break-all">
                <strong className="text-slate-800 dark:text-slate-200">Hospital Wallet:</strong>{" "}
                <span className="font-mono text-xs sm:text-sm">{address ?? "(not connected)"}</span>
              </p>
            </div>
            {isRegistrar === false && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200/60 dark:border-amber-700/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                    </svg>
                  </div>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Your wallet is not an authorized registrar. Contact admin for permissions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-200">
            <MetricCard label="Total Population" value={populationCount.toLocaleString()} />
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-200">
            <MetricCard label="Death Certificates" value={totalDeaths} />
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-200">
            <MetricCard
              label="Registered Records"
              value={records.length}
              hint={isLoading ? "Loading..." : "Hospital records"}
            />
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-200">
            <MetricCard
              label="Access Level"
              value={isRegistrar ? "Authorized" : "Limited"}
              hint={isRegistrar ? "Full access" : "View only"}
            />
          </div>
        </div>

        {/* Action Tabs */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-700/30">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("search")}
                className={`flex-1 px-4 sm:px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "search"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-white/60 dark:bg-slate-800/60"
                    : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="hidden sm:inline">Search & View Records</span>
                <span className="sm:hidden">Search</span>
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 px-4 sm:px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "register"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-white/60 dark:bg-slate-800/60"
                    : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <span className="hidden sm:inline">Register New Patient</span>
                <span className="sm:hidden">Register</span>
              </button>
            </nav>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === "search" && (
              <div className="space-y-6">
                <div className="bg-slate-50/50 dark:bg-slate-700/30 rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50">
                  <SearchComponent role="hospital" />
                </div>

                {/* Additional Hospital Tools */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 py-4"
                    onClick={() => router.push("/upload")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">Record Death Certificate</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 py-4"
                    onClick={() => router.push("/birth")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">Register Birth Certificate</span>
                    </div>
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "register" && (
              <div>
                {isRegistrar ? (
                  <div className="bg-slate-50/50 dark:bg-slate-700/30 rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50">
                    <WalletRegistration
                      onSuccess={() => {
                        // Refresh data or show success message
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-200/50 dark:border-red-800/50">
                      <svg
                        className="w-10 h-10 text-red-600 dark:text-red-400"
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
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-3">Access Restricted</h3>
                    <p className="text-sm sm:text-base text-red-600 dark:text-red-400 max-w-md mx-auto leading-relaxed">
                      Only authorized hospital registrars can register new patients. Contact your administrator to
                      request registration permissions.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Records Table */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Recent Records</h3>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400"></div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading records...</p>
            </div>
          ) : records.length > 0 ? (
            <div className="bg-slate-50/50 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100/60 dark:bg-slate-600/30">
                    <tr>
                      <th className="text-left py-4 px-4 sm:px-6 font-semibold text-slate-700 dark:text-slate-300">
                        Token ID
                      </th>
                      <th className="text-left py-4 px-4 sm:px-6 font-semibold text-slate-700 dark:text-slate-300">
                        Metadata CID
                      </th>
                      <th className="text-left py-4 px-4 sm:px-6 font-semibold text-slate-700 dark:text-slate-300">
                        Timestamp
                      </th>
                      <th className="text-left py-4 px-4 sm:px-6 font-semibold text-slate-700 dark:text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 dark:divide-slate-600/50">
                    {records.slice(0, 5).map((record, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-600/30 transition-colors duration-150"
                      >
                        <td className="py-4 px-4 sm:px-6">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                            #{record.tokenId || index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className="font-mono text-xs bg-slate-200/60 dark:bg-slate-600/60 px-2 py-1 rounded border">
                            {record.metadataCID
                              ? `${record.metadataCID.slice(0, 8)}...${record.metadataCID.slice(-6)}`
                              : "QmExample..."}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-300">
                          {record.timestamp ? new Date(record.timestamp * 1000).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <button
                            onClick={() =>
                              window.open(
                                `https://ipfs.io/ipfs/${record.metadataCID || "QmExample"}`,
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }
                            className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs font-medium transition-colors duration-150"
                          >
                            View IPFS
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
              <div className="w-16 h-16 bg-slate-200/60 dark:bg-slate-600/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-slate-500 dark:text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No records found</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
