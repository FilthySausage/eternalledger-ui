"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useRoleStore } from "~~/services/store/roleStore";

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { role } = useRoleStore();

  useEffect(() => {
    // Redirect to login if not connected
    if (!isConnected) {
      router.replace("/login");
      return;
    }

    // Redirect based on role
    if (role === "user") {
      router.replace("/user");
    } else if (role === "hospital") {
      router.replace("/hospital");
    } else {
      router.replace("/login");
    }
  }, [isConnected, role, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-slate-600 dark:text-slate-300">Redirecting to your dashboard...</p>
      </div>
    </main>
  );
}
