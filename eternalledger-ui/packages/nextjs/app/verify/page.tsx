"use client";

import { useState } from "react";
import Button from "~~/components/ui/Button";

export default function VerifyPage() {
  const [photo, setPhoto] = useState<string | null>(null);

  const handleCapture = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => setPhoto(e.target?.result as string);
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <main className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Document Verification</h1>
      <p className="text-sm opacity-70">Capture a document photo to verify (placeholder flow).</p>
      <Button variant="primary" onClick={handleCapture}>
        Take Photo
      </Button>
      {photo && <img src={photo} alt="capture" className="rounded border" />}
    </main>
  );
}
