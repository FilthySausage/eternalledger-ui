"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import KYCForm from "~~/components/KYCForm";
import SearchComponent from "~~/components/SearchComponent";
import Button from "~~/components/ui/Button";
import MetricCard from "~~/components/ui/MetricCard";
import { useDeathStats } from "~~/hooks/features/useDeathStats";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useRoleStore } from "~~/services/store/roleStore";

export default function UserDashboard() {
  const { address } = useAccount();
  const router = useRouter();
  const { role } = useRoleStore();
  const { totalDeaths } = useDeathStats();

  const [showKYC, setShowKYC] = useState(false);
  const [kycCompleted, setKycCompleted] = useState(false);

  // Mock subscriptions data - in real app, this would come from API
  const [subscriptions] = useState([
    { id: 1, name: "Netflix", status: "active", walletLinked: true },
    { id: 2, name: "Spotify", status: "active", walletLinked: true },
    { id: 3, name: "iCloud+", status: "cancelled", walletLinked: false },
    { id: 4, name: "Disney+", status: "active", walletLinked: true },
  ]);

  // Check if user has completed KYC
  const { data: userTokenId } = useScaffoldReadContract({
    contractName: "EternalLedger",
    functionName: "getTokenByNric",
    args: [""], // Would need user's NRIC, this is simplified
  });

  useEffect(() => {
    if (role !== "user" && typeof window !== "undefined") {
      router.replace("/login");
    }
  }, [role, router]);

  // Mock population data
  const populationCount = 12_345;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                User Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                Welcome to your personal Eternal Ledger portal
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push("/login")} className="shrink-0">
              Switch Portal
            </Button>
          </div>

          <div className="mt-6 bg-slate-50/80 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
            <p className="text-sm text-slate-600 dark:text-slate-400 break-all">
              <strong className="text-slate-800 dark:text-slate-200">Connected Wallet:</strong>{" "}
              <span className="font-mono text-xs sm:text-sm">{address ?? "(not connected)"}</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-200">
            <MetricCard label="Total Population" value={populationCount.toLocaleString()} />
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-200">
            <MetricCard label="Death Certificates" value={totalDeaths} />
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-200 sm:col-span-2 lg:col-span-1">
            <MetricCard
              label="Your Subscriptions"
              value={subscriptions.filter(s => s.status === "active").length}
              hint={`${subscriptions.length} total services`}
            />
          </div>
        </div>

        {/* KYC Status */}
        {!kycCompleted && !showKYC && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200/60 dark:border-amber-700/50 rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-amber-900 dark:text-amber-100 text-lg sm:text-xl">
                  KYC Verification Required
                </h3>
                <p className="text-sm sm:text-base text-amber-800 dark:text-amber-200 mt-1">
                  Complete identity verification to access all features and manage your subscriptions
                </p>
              </div>
              <Button variant="warning" onClick={() => setShowKYC(true)} className="shrink-0 w-full sm:w-auto">
                Complete KYC
              </Button>
            </div>
          </div>
        )}

        {/* KYC Form */}
        {showKYC && (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 sm:p-8">
            <KYCForm
              onSuccess={() => {
                setKycCompleted(true);
                setShowKYC(false);
              }}
              onCancel={() => setShowKYC(false)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Search Component */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-200">
            <SearchComponent role="user" />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Subscriptions Management */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-200">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                Your Subscriptions
              </h3>

              <div className="space-y-3">
                {subscriptions.map(sub => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-4 bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-600/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full shadow-sm ${
                          sub.status === "active" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{sub.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {sub.walletLinked ? "Wallet linked" : "Not linked"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full border ${
                        sub.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Manage Subscriptions
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-200">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                  onClick={() => router.push("/public")}
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Public Search
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                  onClick={() => router.push("/verify")}
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Verify Documents
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
