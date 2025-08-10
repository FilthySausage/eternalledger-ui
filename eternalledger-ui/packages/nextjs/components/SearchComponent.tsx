"use client";

import { useMemo, useState } from "react";
import Button from "~~/components/ui/Button";
import { useRegistry } from "~~/hooks/features/useRegistry";

interface SearchComponentProps {
  role: "user" | "hospital";
  onResult?: (result: any) => void;
}

export default function SearchComponent({ role, onResult }: SearchComponentProps) {
  const [nric, setNric] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { getByTokenId } = useRegistry();

  // Attempt to enrich result with on-chain registry record (metadataCID) once we have a tokenId
  const enriched = useMemo(() => {
    if (!result || !result.tokenId) return result;
    const rec = getByTokenId(Number(result.tokenId));
    if (!rec) return result;
    return {
      ...result,
      cid: result.cid || rec.metadataCID,
      ipfsUrl: result.cid || rec.metadataCID ? `https://ipfs.io/ipfs/${result.cid || rec.metadataCID}` : null,
      timestamp: result.timestamp || (rec.timestamp ? new Date(rec.timestamp * 1000).toISOString() : undefined),
    };
  }, [result, getByTokenId]);

  const handleSearch = async () => {
    if (!nric.trim()) return;

    setIsSearching(true);
    setResult(null);

    try {
      // Search by NRIC in the API
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001"}/search-by-nric/${encodeURIComponent(nric)}`,
      );

      if (res.ok) {
        const data = await res.json();
        const searchResult = {
          status: "deceased",
          tokenId: data.tokenId,
          cid: data.cid || "QmExample123...", // Mock CID
          ipfsUrl: data.cid ? `https://ipfs.io/ipfs/${data.cid}` : null,
          timestamp: data.timestamp || new Date().toISOString(),
        };
        setResult(searchResult);
        onResult?.(searchResult);
      } else {
        const searchResult = {
          status: "alive",
          tokenId: null,
          cid: null,
          ipfsUrl: null,
          timestamp: null,
        };
        setResult(searchResult);
        onResult?.(searchResult);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResult({
        status: "error",
        message: "Search failed. Please try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 space-y-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Search Status by NRIC
      </h3>

      <div className="flex gap-3">
        <input
          type="text"
          value={nric}
          onChange={e => setNric(e.target.value)}
          placeholder="Enter NRIC to search"
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyPress={e => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isSearching || !nric.trim()} variant="primary" loading={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {enriched && (
        <div className="space-y-3">
          <div
            className={`p-4 rounded-lg ${
              enriched.status === "alive"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : enriched.status === "deceased"
                  ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  enriched.status === "alive"
                    ? "bg-green-500"
                    : enriched.status === "deceased"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                }`}
              ></div>
              <span className="font-medium">
                Status:{" "}
                <span
                  className={
                    enriched.status === "alive"
                      ? "text-green-700 dark:text-green-400"
                      : enriched.status === "deceased"
                        ? "text-red-700 dark:text-red-400"
                        : "text-yellow-700 dark:text-yellow-400"
                  }
                >
                  {enriched.status === "alive" ? "Alive" : enriched.status === "deceased" ? "Deceased" : "Error"}
                </span>
              </span>
            </div>

            {enriched.status === "deceased" && (
              <div className="space-y-2 text-sm">
                {enriched.tokenId && (
                  <p>
                    <strong>Token ID:</strong> {enriched.tokenId}
                  </p>
                )}

                {role === "hospital" && enriched.cid && (
                  <div className="space-y-2">
                    <p>
                      <strong>IPFS CID:</strong> {enriched.cid}
                    </p>
                    <button
                      onClick={() =>
                        window.open(`https://ipfs.io/ipfs/${enriched.cid}`, "_blank", "noopener,noreferrer")
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View IPFS JSON File
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* If non-hospital user but we still have a token & cid, show a truncated hint (privacy) */}
                {role === "user" && enriched.cid && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    CID (truncated): {enriched.cid.slice(0, 10)}…
                  </div>
                )}

                {enriched.timestamp && (
                  <p className="text-xs text-slate-500">
                    <strong>Recorded:</strong> {new Date(enriched.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {enriched.status === "error" && (
              <p className="text-sm text-red-700 dark:text-red-400">{enriched.message}</p>
            )}
          </div>
        </div>
      )}

      {role === "hospital" && (
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 rounded p-3">
          <p>
            <strong>Hospital Access:</strong> You can view IPFS records and full death certificate details.
          </p>
        </div>
      )}
    </div>
  );
}
