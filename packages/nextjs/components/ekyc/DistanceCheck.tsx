"use client";
import { useEffect, useState } from "react";
// tiny wrapper around the ML code your teammate wrote
import { verify } from "@/lib/eKYC";

export function DistanceCheck({
  uploadFile,
  selfieBlob,
  onSuccess,
  onFail,
}: {
  uploadFile: File;
  selfieBlob: Blob;
  onSuccess: () => void;
  onFail: () => void;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      const ok = await verify(uploadFile, selfieBlob); // returns boolean
      ok ? onSuccess() : onFail();
      setLoading(false);
    }
    run();
  }, [uploadFile, selfieBlob, onSuccess, onFail]);

  return (
    <div className="text-center">
      {loading ? (
        <span className="loading loading-dots loading-md"></span>
      ) : (
        <p>Done!</p>
      )}
    </div>
  );
}