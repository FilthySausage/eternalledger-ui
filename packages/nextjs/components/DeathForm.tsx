"use client";
import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const DeathForm = () => {
  const [nric, setNric] = useState("");
  const [cid, setCid] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "EternalLedger",
    functionName: "recordDeath",
  });

  const handleUpload = async () => {
    if (!file) return alert("Select file");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("http://localhost:3001/upload", { method: "POST", body: form });
    const { cid: uploadedCid } = await res.json();
    setCid(uploadedCid);
  };

  const handleSubmit = async () => {
    if (!nric || !cid) return alert("Need NRIC & metadata CID");
    await (writeContractAsync as any)({ args: [nric, cid] });
    alert("Death recorded & SDT minted!");
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Death Attestation</h3>
        <input
          className="input input-bordered"
          placeholder="Birth ID (NRIC)"
          value={nric}
          onChange={(e) => setNric(e.target.value)}
        />
        <input
          type="file"
          className="file-input file-input-bordered w-full"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button className="btn btn-sm" onClick={handleUpload}>
          Upload → IPFS
        </button>
        {cid && <p className="text-sm text-success">CID: {cid}</p>}
        <button className="btn btn-secondary mt-2" onClick={handleSubmit}>
          Issue SDT
        </button>
      </div>
    </div>
  );
};