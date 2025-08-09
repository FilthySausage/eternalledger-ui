"use client";
import { useState } from "react";
import { isAddress } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const BirthForm = () => {
  const [nric, setNric] = useState("");
  const [wallet, setWallet] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "EternalLedger",
    functionName: "bindIdentity",
  });

  const handleSubmit = async () => {
    if (!nric || !wallet) return alert("Fill NRIC & wallet");
    if (!isAddress(wallet)) return alert("Invalid address");
    await (writeContractAsync as any)({ args: [nric, wallet] });
    alert("Birth identity bound!");
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Birth Attestation</h3>
        <input
          className="input input-bordered"
          placeholder="Birth ID (NRIC)"
          value={nric}
          onChange={(e) => setNric(e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="Wallet 0x..."
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSubmit}>
          Bind Identity
        </button>
      </div>
    </div>
  );
};