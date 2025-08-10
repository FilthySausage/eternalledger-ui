// src/components/ekyc/CameraCapture.tsx
"use client";
import { useEffect, useRef } from "react";

export function CameraCapture({
  onNext,
  onBack,
}: {
  onNext: (b: Blob) => void;
  onBack: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(console.error);
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  const takePhoto = () => {
    const canvas = canvasRef.current!;
    const video = videoRef.current!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    canvas.toBlob((b) => b && onNext(b), "image/jpeg");
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full max-w-sm rounded"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-2">
        <button className="btn btn-outline" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={takePhoto}>
          Capture
        </button>
      </div>
    </div>
  );
}