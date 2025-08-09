 "use client";

import { useRouter } from "next/navigation";
import { UploadPhoto } from "@/components/ekyc/UploadPhoto";
import { CameraCapture } from "@/components/ekyc/CameraCapture";
import { DistanceCheck } from "@/components/ekyc/DistanceCheck";
import { useState } from "react";

export default function EkycPage() {
  const [step, setStep] = useState<"upload" | "camera" | "check">("upload");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);

  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="card bg-base-100 shadow-xl w-full max-w-lg">
        <div className="card-body">
          <h2 className="card-title">Identity Verification</h2>

          {step === "upload" && (
            <UploadPhoto
              onNext={(file) => {
                setUploadFile(file);
                setStep("camera");
              }}
            />
          )}

          {step === "camera" && (
            <CameraCapture
              onNext={(blob) => {
                setSelfieBlob(blob);
                setStep("check");
              }}
              onBack={() => setStep("upload")}
            />
          )}

          {step === "check" && uploadFile && selfieBlob && (
            <DistanceCheck
              uploadFile={uploadFile}
              selfieBlob={selfieBlob}
              onSuccess={() => {
                // TODO: call smart-contract to bind wallet
                alert("Verification passed!");
                router.push("/dashboard");
              }}
              onFail={() => alert("Please try again")}
            />
          )}
        </div>
      </div>
    </main>
  );
}