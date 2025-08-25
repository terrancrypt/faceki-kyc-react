import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, CameraOff, Download, AlertCircle } from "lucide-react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const WebcamWithFaceDetection = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceCount, setFaceCount] = useState(0);

  // Camera constraints
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  // Load face-api.js models from CDN
  const loadModels = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Loading face-api.js models...");

      // Load models from CDN
      const MODEL_URL =
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model";

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      console.log("Models loaded successfully");
      setIsModelLoaded(true);
    } catch (error) {
      console.error("Error loading models:", error);
      setError("Failed to load face detection models. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Start camera
  const startCamera = useCallback(() => {
    setError(null);
    setIsCameraOn(true);
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    setIsCameraOn(false);
    setCapturedPhoto(null);
    setFaceDetected(false);
    setFaceCount(0);

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  }, []);

  // Face detection function using face-api.js
  const detectFace = async () => {
    if (!webcamRef.current || !canvasRef.current || !isModelLoaded) return;

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;

    try {
      // Set canvas dimensions to match video
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      // Detect faces with landmarks and expressions
      const detections = await faceapi
        .detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.5,
          })
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      // Clear canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections && detections.length > 0) {
        // Resize detections to match display size
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        // Filter for KYC-suitable faces
        const kycSuitableFaces = resizedDetections.filter((detection) => {
          // Check if face is suitable for KYC verification
          const landmarks = detection.landmarks;
          if (!landmarks) return false;

          // Get key facial points
          const leftEye = landmarks.positions[36]; // Left eye corner
          const rightEye = landmarks.positions[45]; // Right eye corner
          const nose = landmarks.positions[30]; // Nose tip
          const leftMouth = landmarks.positions[48]; // Left mouth corner
          const rightMouth = landmarks.positions[54]; // Right mouth corner

          // Calculate face measurements
          const eyeDistance = Math.sqrt(
            Math.pow(rightEye.x - leftEye.x, 2) +
              Math.pow(rightEye.y - leftEye.y, 2)
          );
          const mouthWidth = Math.sqrt(
            Math.pow(rightMouth.x - leftMouth.x, 2) +
              Math.pow(rightMouth.y - leftMouth.y, 2)
          );

          // KYC requirements: face should be reasonably clear and not too tilted
          const faceRatio = eyeDistance / mouthWidth;
          const isReasonableRatio = faceRatio > 0.6 && faceRatio < 2.0; // More flexible

          // Check if face is not too tilted (but allow some angle)
          const faceCenterX = (leftEye.x + rightEye.x) / 2;
          const noseOffset = Math.abs(nose.x - faceCenterX);
          const isNotTooTilted = noseOffset < eyeDistance * 0.5; // More flexible

          // Check if face is reasonably sized (not too small)
          const faceSize = Math.max(eyeDistance, mouthWidth);
          const isGoodSize = faceSize > 30; // Minimum face size

          return isReasonableRatio && isNotTooTilted && isGoodSize;
        });

        // Draw detections
        ctx.strokeStyle = kycSuitableFaces.length > 0 ? "#00ff00" : "#ff0000";
        ctx.lineWidth = 2;
        ctx.fillStyle = kycSuitableFaces.length > 0 ? "#00ff00" : "#ff0000";
        ctx.font = "16px Arial";

        resizedDetections.forEach((detection, i) => {
          const box = detection.detection.box;
          const isKYCSuitable = kycSuitableFaces.includes(detection);

          // Draw bounding box with different colors
          ctx.strokeStyle = isKYCSuitable ? "#00ff00" : "#ff0000";
          ctx.fillStyle = isKYCSuitable ? "#00ff00" : "#ff0000";
          ctx.strokeRect(box.x, box.y, box.width, box.height);

          // Draw confidence score
          const score = Math.round(detection.detection.score * 100);
          const status = isKYCSuitable ? "KYC Ready" : "Not Suitable";
          ctx.fillText(
            `Face ${i + 1}: ${score}% (${status})`,
            box.x,
            box.y > 20 ? box.y - 5 : box.y + box.height + 20
          );

          // Draw landmarks (optional)
          if (detection.landmarks) {
            faceapi.draw.drawFaceLandmarks(canvas, [detection]);
          }
        });

        // Only consider KYC-suitable faces as detected
        setFaceDetected(kycSuitableFaces.length > 0);
        setFaceCount(kycSuitableFaces.length);
      } else {
        setFaceDetected(false);
        setFaceCount(0);
      }
    } catch (error) {
      console.error("Face detection error:", error);
    }
  };

  // Start detection loop
  const startDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    detectionIntervalRef.current = setInterval(() => {
      detectFace();
    }, 100); // Run detection every 100ms
  };

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!webcamRef.current || !photoCanvasRef.current) return;

    const video = webcamRef.current.video;
    const canvas = photoCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Add timestamp
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.lineWidth = 2;
    const timestamp = new Date().toLocaleString("vi-VN");
    const text = `Captured: ${timestamp}`;
    ctx.strokeText(text, 10, canvas.height - 10);
    ctx.fillText(text, 10, canvas.height - 10);

    // Convert to base64
    const photoDataURL = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedPhoto(photoDataURL);
  }, []);

  // Download photo
  const downloadPhoto = useCallback(() => {
    if (!capturedPhoto) return;

    const link = document.createElement("a");
    link.download = `face-photo-${new Date().getTime()}.jpg`;
    link.href = capturedPhoto;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [capturedPhoto]);

  // Handle camera errors
  const handleUserMediaError = useCallback((error: string | DOMException) => {
    console.error("Camera error:", error);
    let errorMessage = "Không thể truy cập camera. ";

    if (error instanceof DOMException) {
      if (error.name === "NotAllowedError") {
        errorMessage += "Please allow camera access and try again.";
      } else if (error.name === "NotFoundError") {
        errorMessage +=
          "Camera not found. Please check your webcam connection.";
      } else if (error.name === "NotReadableError") {
        errorMessage += "Camera is being used by another application.";
      } else {
        errorMessage += error.message;
      }
    } else {
      errorMessage += String(error);
    }

    setError(errorMessage);
    setIsCameraOn(false);
  }, []);

  // Initialize models
  useEffect(() => {
    loadModels();

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Start detection when camera is on and model is loaded
  useEffect(() => {
    if (isCameraOn && isModelLoaded && webcamRef.current?.video) {
      const video = webcamRef.current.video;

      const onLoadedMetadata = () => {
        console.log("Video loaded, starting detection...");
        console.log(
          "Video dimensions:",
          video.videoWidth,
          "x",
          video.videoHeight
        );
        setTimeout(() => {
          startDetection();
        }, 1000);
      };

      if (video.readyState >= 2) {
        onLoadedMetadata();
      } else {
        video.addEventListener("loadedmetadata", onLoadedMetadata);
        return () =>
          video.removeEventListener("loadedmetadata", onLoadedMetadata);
      }
    }
  }, [isCameraOn, isModelLoaded]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading face detection models...</p>
          <p className="text-sm text-gray-500 mt-1">
            This may take a few minutes on first load
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        KYC Face Detection Camera - React Webcam + Face API
      </h1>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="text-red-500" size={20} />
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Close
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Section */}
        <div className="space-y-4">
          <div
            className="relative bg-black rounded-lg overflow-hidden"
            style={{ aspectRatio: "4/3" }}
          >
            {isCameraOn ? (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  onUserMediaError={handleUserMediaError}
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ pointerEvents: "none", transform: "scaleX(-1)" }}
                />

                {/* Face detection indicators */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      faceDetected
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {faceDetected
                      ? `✓ Detected ${faceCount} KYC-suitable face(s)`
                      : "✗ No KYC-suitable face detected"}
                  </div>

                  {isModelLoaded && (
                    <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                      AI Ready
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <CameraOff size={48} className="mx-auto mb-2" />
                  <p>Camera not started</p>
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex gap-3">
            {!isCameraOn ? (
              <button
                onClick={startCamera}
                disabled={!isModelLoaded || isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Camera size={20} />
                Start Camera
              </button>
            ) : (
              <>
                <button
                  onClick={stopCamera}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <CameraOff size={20} />
                  Stop Camera
                </button>
                <button
                  onClick={capturePhoto}
                  disabled={!faceDetected}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  📸 Capture Photo
                </button>
              </>
            )}
          </div>

          {/* Detection Info */}
          {isCameraOn && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  Status:{" "}
                  <span className="font-medium">
                    {faceDetected ? "Detected" : "Searching..."}
                  </span>
                </div>
                <div>
                  KYC-Suitable Faces:{" "}
                  <span className="font-medium">{faceCount}</span>
                </div>
                <div>
                  Model:{" "}
                  <span className="font-medium">
                    {isModelLoaded ? "Ready" : "Loading"}
                  </span>
                </div>
                <div>
                  AI Engine: <span className="font-medium">Face-API.js</span>
                </div>
                <div>
                  Camera: <span className="font-medium">React Webcam</span>
                </div>
                <div>
                  Resolution: <span className="font-medium">640x480</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Captured Photo Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Captured Photo
          </h3>

          <div
            className="bg-gray-100 rounded-lg overflow-hidden"
            style={{ aspectRatio: "4/3" }}
          >
            {capturedPhoto ? (
              <img
                src={capturedPhoto}
                alt="Ảnh đã chụp"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <p>No photo captured yet</p>
                  <p className="text-sm mt-1">
                    Detect a KYC-suitable face to enable capture
                  </p>
                </div>
              </div>
            )}
          </div>

          {capturedPhoto && (
            <button
              onClick={downloadPhoto}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Download size={20} />
              Download
            </button>
          )}
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={photoCanvasRef} className="hidden" />

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            1. Wait for AI models to load (may take a few minutes on first load)
          </li>
          <li>2. Click "Start Camera" and allow webcam access</li>
          <li>3. Position your face in the camera view (some angle is acceptable)</li>
          <li>
            4. When "✓ Detected KYC-suitable face(s)" appears, capture button will be
            enabled
          </li>
          <li>5. Click "📸 Capture Photo" to capture and download the image</li>
        </ul>
      </div>

      {/* Technical Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Using React Webcam + Face-API.js | TinyFaceDetector | KYC Face Detection |
        Models from CDN | Local processing in browser
      </div>
    </div>
  );
};

export default WebcamWithFaceDetection;
