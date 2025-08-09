"use client";
import { useRef } from "react";

export function UploadPhoto({ onNext }: { onNext: (f: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4 items-center">
      <button
        className="btn btn-primary"
        onClick={() => inputRef.current?.click()}
      >
        Upload ID Photo
      </button>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onNext(e.target.files[0])}
      />
    </div>
  );
}