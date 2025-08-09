"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import Button from "~~/components/ui/Button";

export default function UploadPage() {
  const { address } = useAccount();
  const [nric, setNric] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

  const handleUpload = async () => {
    if (!file) return alert("Select file");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${backendUrl}/upload`, { method: "POST", body: form });
    const js = await res.json();
    setCid(js.cid);
  };

  const handleRecord = async () => {
    if (!cid || !nric) return;
    const res = await fetch(`${backendUrl}/record-death`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nric, metadataCID: cid }),
    });
    const js = await res.json();
    if (!res.ok) alert(js.error || "Error");
  };

  return (
    <main className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Record Death (Upload)</h1>
      <p className="text-sm opacity-70">Connected: {address ?? "(not connected)"}</p>
      <div className="card bg-base-100 shadow p-6 flex flex-col gap-3">
        <input
          className="input input-bordered"
          placeholder="NRIC"
          value={nric}
          onChange={e => setNric(e.target.value)}
        />
        <input
          type="file"
          className="file-input file-input-bordered"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
        <Button variant="secondary" onClick={handleUpload}>
          Upload → IPFS
        </Button>
        {cid && <p className="text-xs">CID: {cid}</p>}
        <Button variant="primary" onClick={handleRecord} disabled={!cid}>
          Submit Record
        </Button>
      </div>
    </main>
  );
}
