"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function Home() {
  /* ---------- Wallet ---------- */
  const { address: connectedAddress } = useAccount();

  /* ---------- States ---------- */
  const [nric, setNric] = useState("");
  const [wallet, setWallet] = useState("");
  const [searchNric, setSearchNric] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState("");
  const [backendUrl] = useState("http://localhost:3001"); // backend runs on 3001

  /* ---------- Contract hooks ---------- */
  const { writeContractAsync: bindIdentity } = useScaffoldWriteContract({
    contractName: "EternalLedger",
    functionName: "bindIdentity",
    args: [nric, wallet as `0x${string}`],
  });

  const { data: isDeceased } = useScaffoldReadContract({
    contractName: "EternalLedger",
    functionName: "isDeceased",
    args: [searchNric],
  });

  const { data: tokenId } = useScaffoldReadContract({
    contractName: "EternalLedger",
    functionName: "getTokenByNric",
    args: [searchNric],
  });

  /* ---------- Handlers ---------- */
  const handleBind = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nric || !wallet) return alert("Fill NRIC & wallet");
    try {
      await (bindIdentity as any)({ args: [nric, wallet as `0x${string}`] });
      alert("Identity bound!");
    } catch (err) {
      alert(err);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select file");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${backendUrl}/upload`, { method: "POST", body: form });
    const { cid: uploadedCid } = await res.json();
    setCid(uploadedCid);
  };

  const handleRecordDeath = async () => {
    if (!nric || !cid) return alert("Need NRIC & CID");
    const res = await fetch(`${backendUrl}/record-death`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nric, metadataCID: cid }),
    });
    const data = await res.json();
    res.ok ? alert("Death recorded!") : alert(data.error);
  };

  const handleSearch = async () => {
    if (!searchNric) return;
    const res = await fetch(`${backendUrl}/search-by-nric/${searchNric}`);
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  };

  /* ---------- Render ---------- */
  return (
    <div className="flex flex-col items-center p-8 space-y-8">
      <h1 className="text-3xl font-bold">Eternal Ledger</h1>

      {/* Wallet */}
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Wallet</h2>
          <Address address={connectedAddress} />
        </div>
      </div>

      {/* Bind Identity */}
      <form onSubmit={handleBind} className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Bind Identity</h2>
          <input
            className="input input-bordered"
            placeholder="NRIC (e.g. S1234567A)"
            value={nric}
            onChange={e => setNric(e.target.value)}
          />
          <input
            className="input input-bordered"
            placeholder="Wallet 0x..."
            value={wallet}
            onChange={e => setWallet(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Bind
          </button>
        </div>
      </form>

      {/* Record Death */}
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Record Death</h2>
          <input
            className="input input-bordered"
            placeholder="NRIC"
            value={nric}
            onChange={e => setNric(e.target.value)}
          />
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
          <button onClick={handleUpload} className="btn btn-sm">
            Upload → IPFS
          </button>
          {cid && <p className="text-sm text-success">CID: {cid}</p>}
          <button onClick={handleRecordDeath} className="btn btn-secondary">
            Mint Death SBT
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Search by NRIC</h2>
          <input
            className="input input-bordered"
            placeholder="NRIC"
            value={searchNric}
            onChange={e => setSearchNric(e.target.value)}
          />
          <button onClick={handleSearch} className="btn btn-info">
            Search
          </button>
          {isDeceased !== undefined ? (
            <p>Deceased: {isDeceased ? "Yes" : "No"}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}