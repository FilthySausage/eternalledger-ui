"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CameraCapture } from "@/components/ekyc/CameraCapture";
import { DistanceCheck } from "@/components/ekyc/DistanceCheck";
import { UploadPhoto } from "@/components/ekyc/UploadPhoto";
import * as faceapi from "face-api.js";
import { useAccount } from "wagmi";

const MODEL_PATH = "/model"; // public/model

export default function EkycPage() {
  const [step, setStep] = useState<"nric" | "upload" | "verify">("nric");
  const [nric, setNric] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);
  const [matchResult, setMatchResult] = useState<"match" | "not match" | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const { address: wallet } = useAccount();
  const [isBinding, setIsBinding] = useState(false);

  // Modal states
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [showBindConfirm, setShowBindConfirm] = useState(false);
  const [hasAskedBind, setHasAskedBind] = useState(false);

  const router = useRouter();

  // Load face-api models once
  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_PATH),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_PATH),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_PATH),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Model load error", err);
      }
    })();
  }, []);

  const openModal = (msg: string) => {
    setModalMessage(msg);
  };

  const closeModal = () => {
    setModalMessage(null);
    // After closing info modal, redirect to home
    router.push("/");
  };

  const handleBindIdentity = async () => {
    if (!nric || !wallet) {
      openModal("❌ Missing NRIC or wallet address");
      return;
    }
    setIsBinding(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";
      const res = await fetch(`${backendUrl}/bind-identity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nric, wallet }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Backend error");
      openModal("✅ IC bound to wallet!");
    } catch (e: any) {
      openModal("❌ " + e.message);
    } finally {
      setIsBinding(false);
      setShowBindConfirm(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="card w-full max-w-5xl shadow-xl bg-base-100">
        <div className="card-body">
          <h1 className="text-2xl font-bold mb-6">eKYC Verification</h1>

          {/* Step 1: Enter NRIC */}
          {step === "nric" && (
            <div className="flex flex-col gap-4 items-center">
              <input
                className="input input-bordered w-64"
                placeholder="Enter your NRIC"
                value={nric}
                onChange={e => setNric(e.target.value)}
              />
              <button className="btn btn-primary w-64" disabled={!nric} onClick={() => setStep("upload")}>
                Next: Upload IC Photo
              </button>
            </div>
          )}

          {/* Step 2: Upload IC photo */}
          {step === "upload" && (
            <div className="flex flex-col gap-4 items-center">
              <p className="font-semibold">Upload your IC photo</p>
              <UploadPhoto onNext={file => setUploadFile(file)} />
              <div className="flex gap-4">
                <button className="btn btn-secondary" onClick={() => setStep("nric")}>
                  ← Back
                </button>
                <button className="btn btn-primary" disabled={!uploadFile} onClick={() => setStep("verify")}>
                  Next: Verify Face
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Verify Face */}
          {step === "verify" && (
            <div className="flex flex-col gap-6 items-center">
              <div className="flex justify-between w-full gap-4">
                {/* 1st Frame: Uploaded IC photo */}
                <div className="flex-1 border rounded p-2 flex flex-col items-center">
                  <p className="font-semibold mb-2">Uploaded IC</p>
                  {uploadFile ? (
                    <img src={URL.createObjectURL(uploadFile)} alt="IC" className="max-h-64 object-contain" />
                  ) : (
                    <p className="text-sm text-gray-500">No IC uploaded</p>
                  )}
                </div>

                {/* 2nd Frame: Camera capture */}
                <div className="flex-1 border rounded p-2 flex flex-col items-center">
                  <p className="font-semibold mb-2">Live Capture</p>
                  <CameraCapture
                    onNext={(blob: Blob) => {
                      setSelfieBlob(blob);
                      setMatchResult(null);
                    }}
                    onBack={() => {
                      setSelfieBlob(null);
                    }}
                  />
                </div>

                {/* 3rd Frame: Match status */}
                <div className="flex-1 border rounded p-2 flex flex-col items-center">
                  <p className="font-semibold mb-2">Match Status</p>
                  <div className="w-full h-64 border rounded flex flex-col items-center justify-center p-4">
                    {uploadFile && selfieBlob ? (
                      <DistanceCheck
                        uploadFile={uploadFile}
                        selfieBlob={selfieBlob}
                        onSuccess={async () => {
                          setMatchResult("match");
                          if (!hasAskedBind) {
                            setShowBindConfirm(true);
                            setHasAskedBind(true);
                          }
                        }}
                        onFail={() => {
                          setMatchResult("not match");
                          setSelfieBlob(null);
                        }}
                      />
                    ) : (
                      <p className="text-gray-500 text-sm text-center">Capture a selfie to check.</p>
                    )}
                  </div>
                  {matchResult && (
                    <p className={`mt-2 font-bold ${matchResult === "match" ? "text-green-600" : "text-red-600"}`}>
                      {matchResult === "match" ? "✅ Match" : "❌ Not Match"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button className="btn btn-secondary" onClick={() => setStep("upload")}>
                  ← Back
                </button>
                <button className="btn btn-primary" disabled={isBinding} onClick={() => setSelfieBlob(null)}>
                  Retake Selfie
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Modal */}
      {modalMessage && (
        <div className="modal modal-open">
          <div className="modal-box">
            <p className="py-4">{modalMessage}</p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bind Confirm Modal */}
      {matchResult === "match" && showBindConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <p className="py-4">
              Bind your IC number <strong>{nric}</strong> to your wallet address <strong>{wallet}</strong>?
            </p>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleBindIdentity}>
                Yes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowBindConfirm(false);
                  router.push("/"); // Redirect home on cancel
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
