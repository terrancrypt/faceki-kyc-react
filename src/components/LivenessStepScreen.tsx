import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

interface LivenessStepScreenProps {
  step: "front" | "left" | "right";
  onStepComplete: (step: "front" | "left" | "right", photoData: string) => void;
  onStepFailed: (step: "front" | "left" | "right", error: string) => void;
  isModelLoaded: boolean;
  videoConstraints: any;
  webcamRef: React.RefObject<Webcam | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  photoCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  isRecording?: boolean;
}

const LivenessStepScreen: React.FC<LivenessStepScreenProps> = ({
  step,
  onStepComplete,
  // onStepFailed,
  isModelLoaded,
  videoConstraints,
  webcamRef,
  canvasRef,
  photoCanvasRef,
  isRecording = false,
}) => {
  const [stableTime, setStableTime] = useState(0);
  const [currentAngle, setCurrentAngle] = useState("front");
  const [angleRatio, setAngleRatio] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [progress, setProgress] = useState(0);

  const detectionIntervalRef = useRef<number | null>(null);
  const stableTimeRef = useRef(0);

  const stepConfig = {
    front: {
      title: "Nhìn thẳng vào camera",
      instruction: "Nhìn thẳng vào camera và giữ nguyên tư thế trong 3 giây",
      targetAngle: "front",
      threshold: 0.08,
      icon: "👁️",
      color: "blue",
      stableTimeRequired: 3000,
    },
    left: {
      title: "Quay đầu sang trái",
      instruction:
        "Quay đầu sang TRÁI (mũi sang phải) và giữ nguyên tư thế trong 3 giây",
      targetAngle: "left",
      threshold: 0.08,
      icon: "👈",
      color: "green",
      stableTimeRequired: 3000,
    },
    right: {
      title: "Quay đầu sang phải",
      instruction:
        "Quay đầu sang PHẢI (mũi sang trái) và giữ nguyên tư thế trong 3 giây",
      targetAngle: "right",
      threshold: 0.08,
      icon: "👉",
      color: "purple",
      stableTimeRequired: 3000,
    },
  };

  const config = stepConfig[step];

  const startDetection = () => {
    if (!isModelLoaded || !webcamRef.current?.video) return;

    setProgress(0);
    stableTimeRef.current = 0;
    setStableTime(0);

    const detectFace = async () => {
      if (!webcamRef.current || !canvasRef.current) return;

      const video = webcamRef.current.video;
      const canvas = canvasRef.current;

      if (!video || video.videoWidth === 0) return;

      try {
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 416,
              scoreThreshold: 0.5,
            })
          )
          .withFaceLandmarks();

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections && Array.isArray(detections) && detections.length > 0) {
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );
          setFaceDetected(true);

          ctx.strokeStyle = "#00ff00";
          ctx.lineWidth = 2;
          ctx.fillStyle = "#00ff00";
          ctx.font = "16px Arial";

          resizedDetections.forEach((detection) => {
            // Thêm box xác định khuôn mặt nếu cần
            // const box = detection.detection.box;
            // ctx.strokeRect(box.x, box.y, box.width, box.height);

            if (detection.landmarks) {
              faceapi.draw.drawFaceLandmarks(canvas, [detection]);
            }
          });

          if (detections[0] && detections[0].landmarks) {
            const landmarks = detections[0].landmarks;
            const leftEye = landmarks.positions[36];
            const rightEye = landmarks.positions[45];
            const nose = landmarks.positions[30];

            const eyeCenterX = (leftEye.x + rightEye.x) / 2;
            const noseOffset = nose.x - eyeCenterX;
            const faceWidth = Math.abs(rightEye.x - leftEye.x);
            const ratio = Math.abs(noseOffset) / faceWidth;

            let detectedAngle = "front";
            if (ratio > config.threshold) {
              detectedAngle = noseOffset > 0 ? "left" : "right";
            }

            setCurrentAngle(detectedAngle);
            setAngleRatio(ratio);

            const isMatch = detectedAngle === config.targetAngle;

            if (isMatch) {
              const newTime = stableTimeRef.current + 100;
              stableTimeRef.current = newTime;
              setStableTime(newTime);

              const progressPercent = Math.min(
                (newTime / config.stableTimeRequired) * 100,
                100
              );
              setProgress(progressPercent);

              if (newTime >= config.stableTimeRequired) {
                capturePhoto();
              }
            } else {
              if (stableTimeRef.current > 0) {
                stableTimeRef.current = 0;
                setStableTime(0);
                setProgress(0);
              }
            }
          }
        } else {
          setFaceDetected(false);
          stableTimeRef.current = 0;
          setStableTime(0);
          setProgress(0);
        }
      } catch (error) {
        // Handle error silently
      }
    };

    detectionIntervalRef.current = setInterval(
      detectFace,
      100
    ) as unknown as number;
  };

  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!webcamRef.current || !photoCanvasRef.current) return;

    const video = webcamRef.current.video;
    const canvas = photoCanvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!video || !ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const photoData = canvas.toDataURL("image/jpeg");
    onStepComplete(step, photoData);
  };

  useEffect(() => {
    if (isModelLoaded) {
      startDetection();
    }

    return () => {
      stopDetection();
    };
  }, [isModelLoaded, step]);

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          {config.icon} {config.title}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          {config.instruction}
        </p>
      </div>

      {/* Camera Feed */}
      <div
        className="relative bg-black rounded-lg overflow-hidden border-4 mb-4"
        style={{
          aspectRatio: "4/3",
          borderColor: faceDetected ? "#10b981" : "#6b7280",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ pointerEvents: "none", transform: "scaleX(-1)" }}
        />

        {/* Status Overlay */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 space-y-1 sm:space-y-2">
          <div
            className={`px-2 sm:px-3 py-1 bg-${config.color}-500 text-white text-xs sm:text-sm font-medium rounded-full`}
          >
            {config.title}
          </div>
          <div
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
              faceDetected ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {faceDetected
              ? "✓ Phát hiện khuôn mặt"
              : "✗ Chưa phát hiện khuôn mặt"}
          </div>
          <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
            Phát hiện: {currentAngle} (Ratio: {angleRatio.toFixed(3)})
          </div>
          <div className="px-2 py-1 bg-orange-500 text-white text-xs rounded">
            Stable: {stableTime}ms / {config.stableTimeRequired}ms
          </div>
          <div
            className={`px-2 py-1 text-white text-xs rounded ${
              currentAngle === config.targetAngle
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {currentAngle === config.targetAngle ? "✅ Match" : "❌ Mismatch"}
          </div>
          {isRecording && (
            <div className="px-2 py-1 bg-red-500 text-white text-xs rounded flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Đang ghi video
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="text-white text-center">
              <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2">
                Đang xác nhận tư thế...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div
                  className="bg-green-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs sm:text-sm mt-1">{Math.round(progress)}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={photoCanvasRef} className="hidden" />
    </div>
  );
};

export default LivenessStepScreen;
