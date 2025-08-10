"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import Button from "~~/components/ui/Button";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface WalletRegistrationProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function WalletRegistration({ onSuccess, onCancel }: WalletRegistrationProps) {
  const { address } = useAccount();
  const [newbornNric, setNewbornNric] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContractAsync } = useScaffoldWriteContract("EternalLedger");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newbornNric.trim() || !walletAddress.trim()) return;

    setIsSubmitting(true);
    try {
      await writeContractAsync({
        functionName: "bindIdentity",
        args: [newbornNric, walletAddress as `0x${string}`],
      });
      alert("Newborn registration completed successfully!");
      onSuccess?.();
      setNewbornNric("");
      setWalletAddress("");
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Registration failed. Please check your permissions and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Register New Patient</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Register a new wallet with instant KYC for newborn patients
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Newborn NRIC</label>
          <input
            type="text"
            value={newbornNric}
            onChange={e => setNewbornNric(e.target.value)}
            placeholder="Enter newborn's NRIC"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Parent/Guardian Wallet Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={e => setWalletAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <strong>Hospital Address:</strong> {address}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Only authorized hospital registrars can perform this action
          </p>
        </div>

        <div className="flex gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={!newbornNric.trim() || !walletAddress.trim()}
            className="flex-1"
          >
            {isSubmitting ? "Registering..." : "Register & Verify"}
          </Button>
        </div>
      </form>

      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p>• Instant KYC verification for newborn patients</p>
        <p>• Links parent/guardian wallet to newborn identity</p>
        <p>• Creates secure on-chain birth record</p>
      </div>
    </div>
  );
}
