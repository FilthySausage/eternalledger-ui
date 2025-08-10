"use client";

// Importing the untyped version via index export (still typed to example contract); we'll build a thin wrapper.
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const useDeathStats = () => {
  // Temporary loose call: the scaffold generated types don't yet know EternalLedger ABI.
  const { data, isLoading } = (useScaffoldReadContract as any)({
    contractName: "EternalLedger",
    functionName: "getDeathStatistics",
    args: [],
  });

  const [totalDeaths, oldestTokenId, newestTokenId, contractCreationTime] = (data as bigint[] | undefined) || [];

  return {
    isLoading,
    totalDeaths: totalDeaths ? Number(totalDeaths) : 0,
    oldestTokenId: oldestTokenId ? Number(oldestTokenId) : 0,
    newestTokenId: newestTokenId ? Number(newestTokenId) : 0,
    contractCreationTime: contractCreationTime ? Number(contractCreationTime) : 0,
  };
};
