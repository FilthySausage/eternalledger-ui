"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Button from "~~/components/ui/Button";
import { useRoleStore } from "~~/services/store/roleStore";

export default function LoginPage() {
  const router = useRouter();
  const { role, setRole } = useRoleStore();
  const { isConnected } = useAccount();
  const [selected, setSelected] = useState<"user" | "hospital">("user");

  useEffect(() => {
    if (role && isConnected) {
      router.replace(role === "hospital" ? "/hospital" : "/user");
    }
  }, [role, router, isConnected]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    setRole(selected);
    router.push(selected === "hospital" ? "/hospital" : "/user");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-light">
            Choose Your Portal
            <span className="block text-indigo-500 dark:text-indigo-400 font-normal text-2xl mt-2">
              Eternal Ledger Access
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300">Select your access level to continue to the platform</p>
        </header>

        {/* Wallet connection */}
        <div className="flex justify-center">
          <ConnectButton />
        </div>

        {isConnected && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* User Portal Card */}
              <label
                className={`cursor-pointer transition-all duration-200 ${selected === "user" ? "ring-2 ring-indigo-500" : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={selected === "user"}
                  onChange={e => setSelected(e.target.value as "user" | "hospital")}
                  className="sr-only"
                />
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 h-full border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">User Portal</h3>
                  </div>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <li>• Search status by NRIC</li>
                    <li>• View subscription management</li>
                    <li>• Complete KYC verification</li>
                    <li>• Bind wallet to identity</li>
                  </ul>
                </div>
              </label>

              {/* Hospital Portal Card */}
              <label
                className={`cursor-pointer transition-all duration-200 ${selected === "hospital" ? "ring-2 ring-indigo-500" : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="hospital"
                  checked={selected === "hospital"}
                  onChange={e => setSelected(e.target.value as "user" | "hospital")}
                  className="sr-only"
                />
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 h-full border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Hospital Portal</h3>
                  </div>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <li>• Search & view IPFS records</li>
                    <li>• Register new patients</li>
                    <li>• Instant KYC verification</li>
                    <li>• Manage birth/death records</li>
                  </ul>
                </div>
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full max-w-md mx-auto">
              Enter {selected === "hospital" ? "Hospital" : "User"} Portal
            </Button>
          </form>
        )}

        {!isConnected && (
          <div className="text-center text-slate-500 dark:text-slate-400">
            <p>Please connect your wallet to access the portal</p>
          </div>
        )}
      </div>
    </main>
  );
}
