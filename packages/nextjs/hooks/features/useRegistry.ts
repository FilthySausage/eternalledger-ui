"use client";

import { useMemo, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type RegistryRecord = {
  tokenId: number;
  metadataCID: string;
  timestamp: number;
};

export const useRegistry = () => {
  const { data, isLoading } = (useScaffoldReadContract as any)({
    contractName: "EternalLedger",
    functionName: "getAllDeceased",
    args: [],
  });

  const [tokenIds, records] = (data as any[]) || [];
  const parsed: RegistryRecord[] = useMemo(() => {
    if (!tokenIds || !records) return [];
    try {
      return (tokenIds as bigint[]).map((tid, i) => ({
        tokenId: Number(tid),
        metadataCID: records[i].metadataCID as string,
        timestamp: Number(records[i].timestamp),
      }));
    } catch {
      return [];
    }
  }, [tokenIds, records]);

  const [filter, setFilter] = useState("");
  const filtered = useMemo(
    () => parsed.filter(r => !filter || r.metadataCID.includes(filter) || r.tokenId.toString() === filter),
    [parsed, filter],
  );

  return { isLoading, records: filtered, total: parsed.length, filter, setFilter };
};

export type { RegistryRecord };
