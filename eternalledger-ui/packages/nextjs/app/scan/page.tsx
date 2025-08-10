"use client";

import { useState } from "react";
import Button from "~~/components/ui/Button";

export default function ScanPage() {
  const [scanned, setScanned] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleScan = () => {
    setResult(scanned);
  };

  return (
    <main className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Scan</h1>
      <input
        className="input input-bordered w-full"
        placeholder="Paste / enter QR payload"
        value={scanned}
        onChange={e => setScanned(e.target.value)}
      />
      <Button variant="primary" onClick={handleScan}>
        SCAN
      </Button>
      {result && <div className="alert alert-info whitespace-pre-wrap break-all">{result}</div>}
    </main>
  );
}
