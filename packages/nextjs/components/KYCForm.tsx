"use client";

import { useCallback, useRef, useState } from "react";
import { useAccount } from "wagmi";
import Button from "~~/components/ui/Button";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface KYCFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function KYCForm({ onSuccess, onCancel }: KYCFormProps) {
  const { address } = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [nric, setNric] = useState("");
  const [icImage, setIcImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const { writeContractAsync } = useScaffoldWriteContract("EternalLedger");

  // Start camera for selfie capture
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please ensure you have granted camera permissions.");
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  }, [stream]);

  // Capture selfie from video
  const captureSelfie = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setSelfieImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  // Handle IC image upload
  const handleIcUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setIcImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate face verification (hardcoded to always pass)
  const verifyFaces = async () => {
    setIsVerifying(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVerificationResult(true); // Hardcoded to always pass
    setIsVerifying(false);
  };

  // Handle KYC submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nric.trim() || !address || !verificationResult) return;

    setIsSubmitting(true);
    try {
      await writeContractAsync({
        functionName: "bindIdentity",
        args: [nric, address],
      });
      alert("KYC completed successfully! Your wallet is now bound to your identity.");
      onSuccess?.();
      setNric("");
    } catch (error) {
      console.error("KYC Error:", error);
      alert("KYC failed. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map(step => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= step ? "bg-indigo-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              {step}
            </div>
            {step < 4 && (
              <div
                className={`w-12 h-0.5 mx-2 ${currentStep > step ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Complete KYC Verification</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Verify your identity by uploading your IC and taking a selfie
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-left">Your NRIC</label>
            <input
              type="text"
              value={nric}
              onChange={e => setNric(e.target.value)}
              placeholder="Enter your NRIC"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <Button onClick={nextStep} disabled={!nric.trim()} className="w-full">
            Continue
          </Button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Upload Identity Card</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Please upload a clear photo of your Identity Card
            </p>
          </div>

          {!icImage ? (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Click to upload your IC or drag and drop
              </p>
              <input type="file" accept="image/*" onChange={handleIcUpload} className="hidden" id="ic-upload" />
              <label
                htmlFor="ic-upload"
                className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                Choose File
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={icImage}
                  alt="Identity Card"
                  className="w-full max-w-md mx-auto rounded-lg border shadow-sm"
                />
                <button
                  onClick={() => setIcImage(null)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 text-center">
                ✓ Identity Card uploaded successfully
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={prevStep} className="flex-1">
              Back
            </Button>
            <Button onClick={nextStep} disabled={!icImage} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Take a Selfie</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Take a clear photo of yourself for face verification
            </p>
          </div>

          {!selfieImage ? (
            <div className="space-y-4">
              {!cameraActive ? (
                <div className="text-center space-y-4">
                  <div className="w-64 h-48 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto">
                    <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <Button onClick={startCamera}>Open Camera</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full max-w-md mx-auto rounded-lg bg-black"
                    />
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={stopCamera}>
                      Cancel
                    </Button>
                    <Button onClick={captureSelfie}>Take Photo</Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img src={selfieImage} alt="Selfie" className="w-full max-w-md mx-auto rounded-lg border shadow-sm" />
                <button
                  onClick={() => setSelfieImage(null)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 text-center">✓ Selfie captured successfully</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={prevStep} className="flex-1">
              Back
            </Button>
            <Button onClick={nextStep} disabled={!selfieImage} className="flex-1">
              Continue
            </Button>
          </div>

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Verify Identity</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Comparing your IC photo with your selfie</p>
          </div>

          {verificationResult === null && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Identity Card</p>
                  <img src={icImage!} alt="IC" className="w-full rounded-lg border" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Your Selfie</p>
                  <img src={selfieImage!} alt="Selfie" className="w-full rounded-lg border" />
                </div>
              </div>

              {!isVerifying && (
                <Button onClick={verifyFaces} className="w-full">
                  Verify Faces
                </Button>
              )}

              {isVerifying && (
                <div className="text-center space-y-4">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Analyzing facial features...</p>
                </div>
              )}
            </div>
          )}

          {verificationResult === true && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-700 dark:text-green-400">Verification Successful!</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Your identity has been verified. Complete KYC to bind your wallet.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>Wallet to bind:</strong> {address}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" loading={isSubmitting} disabled={!verificationResult} className="flex-1">
                    {isSubmitting ? "Completing KYC..." : "Complete KYC"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {onCancel && (
            <div className="text-center">
              <Button variant="ghost" onClick={onCancel}>
                Cancel Process
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
