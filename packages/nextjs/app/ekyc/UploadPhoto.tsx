"use client";

import { useEffect, useRef, useState } from "react";

interface UploadPhotoProps {
  onNext: (file: File) => void;
}

export function UploadPhoto({ onNext }: UploadPhotoProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onNext(file);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      {/* Upload Button */}
      <button type="button" className="btn btn-sm btn-primary" onClick={() => fileInputRef.current?.click()}>
        Upload IC Photo
      </button>

      {/* Filename preview */}
      {fileName && <p className="text-xs text-gray-500">{fileName}</p>}
    </div>
  );
}
