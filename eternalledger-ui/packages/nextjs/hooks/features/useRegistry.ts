"use client";

import { useCallback, useMemo, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type RegistryRecord = {
  tokenId: number;
  metadataCID: string;
  timestamp: number; // unix seconds
};

export const useRegistry = () => {
  /**
   * Raw on-chain response is expected to be: [ tokenIds[], records[] ] where
   *   tokenIds: bigint[]
   *   records[i]: { metadataCID: string; timestamp: bigint }
   * We defensively parse & normalise to a flat array of RegistryRecord objects.
   */
  const { data, isLoading } = (useScaffoldReadContract as any)({
    contractName: "EternalLedger",
    functionName: "getAllDeceased",
    args: [],
  });

  // Gracefully destructure only if data is an array with at least 2 elements.
  const tokenIds: unknown = Array.isArray(data) ? (data as any[])[0] : undefined;
  const rawRecords: unknown = Array.isArray(data) ? (data as any[])[1] : undefined;

  const parsed: RegistryRecord[] = useMemo(() => {
    if (!Array.isArray(tokenIds) || !Array.isArray(rawRecords)) return [];
    try {
      return (tokenIds as bigint[]).map((tid, i) => {
        const rec = (rawRecords as any[])[i] || {};
        return {
          tokenId: Number(tid),
          metadataCID: String(rec.metadataCID ?? rec.cid ?? ""),
          timestamp: Number(rec.timestamp ?? 0),
        } as RegistryRecord;
      });
    } catch (err) {
      console.warn("useRegistry: parse failure", err);
      return [];
    }
  }, [tokenIds, rawRecords]);

  // Filter state (by tokenId exact match OR substring of CID)
  const [filter, setFilter] = useState("");
  const filtered = useMemo(() => {
    const f = filter.trim();
    if (!f) return parsed;
    return parsed.filter(r => r.metadataCID.includes(f) || r.tokenId.toString() === f);
  }, [parsed, filter]);

  // Helper to retrieve a single record quickly
  const getByTokenId = useCallback((id: number) => parsed.find(r => r.tokenId === id) || null, [parsed]);

  return {
    isLoading,
    records: filtered,
    total: parsed.length,
    filter,
    setFilter,
    getByTokenId,
    hasData: parsed.length > 0,
    raw: data, // expose raw for advanced consumers / debugging
  };
};

export type { RegistryRecord };
