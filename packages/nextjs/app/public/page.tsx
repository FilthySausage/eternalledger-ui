"use client";
import { useState } from "react";
import { StatusChip } from "~~/components/StatusChip";

export default function PublicSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query) return;
    const res = await fetch(`/api/search?nric=${query}`);
    const data = await res.json();
    setResults(Array.isArray(data) ? data : [data]);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Public Registry Search</h1>
      <div className="join w-full">
        <input
          className="input input-bordered join-item w-full"
          placeholder="Birth ID / Address"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="btn btn-primary join-item" onClick={handleSearch}>Search</button>
      </div>

      <div className="mt-6 space-y-4">
        {results.map(r => (
          <div key={r.id} className="card bg-base-100 shadow">
            <div className="card-body flex items-center justify-between">
              <div>
                <p className="font-bold">{r.nric}</p>
                <p className="text-xs text-gray-500">{r.address}</p>
              </div>
              <StatusChip status={r.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}