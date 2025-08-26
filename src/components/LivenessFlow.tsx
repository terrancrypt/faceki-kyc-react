import React from "react";
import Webcam from "react-webcam";
import LivenessStepScreen from "./LivenessStepScreen";
import { Camera, Download, RotateCcw, Video } from "lucide-react";
import { useLivenessFlow } from "../hooks/useLivenessFlow";

interface LivenessFlowProps {
  isModelLoaded: boolean;
  videoConstraints: any;
  onComplete: (capturedAngles: {
    front: string | null;
    left: string | null;
    right: string | null;
    video: string | null;
  }) => void;
  onBack: () => void;
}

const LivenessFlow: React.FC<LivenessFlowProps> = ({
  isModelLoaded,
  videoConstraints,
  onComplete,
  onBack,
}) => {
  const {
    currentStep,
    capturedAngles,
    isComplete,
    error,
    isRecording,
    recordedVideo,
    isVideoProcessing,
    countdown,
    isCountdownActive,
    isStarted,
    isPaused,
    mediaRecorderRef,
    startLivenessTest,
    pauseLivenessTest,
    resumeLivenessTest,
    restartRecording,
    resetFlow,
    handleStepComplete,
    handleStepFailed,
    downloadAllAngles,
    downloadVideo,
    setError,
  } = useLivenessFlow({ onComplete });

  const webcamRef = React.useRef<Webcam>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const photoCanvasRef = React.useRef<HTMLCanvasElement>(null);

  // Set refs for the hook
  React.useEffect(() => {
    if (webcamRef.current) {
      // Set the webcam ref for the hook to access stream
      mediaRecorderRef.current = webcamRef.current;

      // If we're already recording, restart recording with the new webcam
      if (isStarted && !isCountdownActive && !isPaused) {
        restartRecording();
      }
    }
  }, [webcamRef.current, isStarted, isCountdownActive, isPaused]);

  if (isComplete) {
    return (
      <div className="max-w-6xl mx-auto p-3 sm:p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-4 sm:mb-6">
          <div className="text-4xl sm:text-6xl mb-4">🎉</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Hoàn thành Liveness Test!
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Tất cả 3 góc đã được chụp thành công
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Captured Photos */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              📸 Ảnh Liveness đã chụp
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {Object.entries(capturedAngles).map(([angle, photoData]) => (
                <div key={angle} className="text-center">
                  {photoData ? (
                    <div className="bg-gray-100 rounded-lg p-1 sm:p-2">
                      <img
                        src={photoData}
                        alt={`Góc ${angle}`}
                        className="w-full h-20 sm:h-32 object-cover rounded mb-1 sm:mb-2"
                      />
                      <p className="text-xs sm:text-sm font-medium text-gray-700 capitalize">
                        {angle === "front" && "Nhìn thẳng"}
                        {angle === "left" && "Quay trái"}
                        {angle === "right" && "Quay phải"}
                      </p>
                      <div className="text-green-600 text-xs">✅ Đã chụp</div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-1 sm:p-2 h-28 sm:h-40 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <div className="text-xl sm:text-2xl mb-1">❌</div>
                        <p className="text-xs">Chưa chụp</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recorded Video */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              🎥 Video Liveness
            </h3>
            {recordedVideo ? (
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <video
                  src={recordedVideo}
                  controls
                  className="w-full"
                  style={{ maxHeight: "200px" }}
                >
                  Trình duyệt không hỗ trợ video
                </video>
              </div>
            ) : isVideoProcessing ? (
              <div className="bg-gray-100 rounded-lg p-4 sm:p-8 text-center">
                <div className="text-3xl sm:text-4xl mb-2">⏳</div>
                <p className="text-sm sm:text-base text-gray-600">
                  Video đang được xử lý...
                </p>
                <div className="mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-4 sm:p-8 text-center">
                <div className="text-3xl sm:text-4xl mb-2">📹</div>
                <p className="text-sm sm:text-base text-gray-600">
                  {isComplete ? "Video đang được xử lý..." : "Chưa có video"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-4 sm:mt-6">
          <button
            onClick={downloadAllAngles}
            className="flex items-center gap-1 sm:gap-2 bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 font-medium text-sm sm:text-base"
          >
            <Download size={16} />
            Tải xuống ảnh
          </button>
          {recordedVideo && !isVideoProcessing && (
            <button
              onClick={downloadVideo}
              className="flex items-center gap-1 sm:gap-2 bg-purple-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-purple-700 font-medium text-sm sm:text-base"
            >
              <Video size={16} />
              Tải xuống video
            </button>
          )}

          <button
            onClick={resetFlow}
            className="flex items-center gap-1 sm:gap-2 bg-orange-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-700 font-medium text-sm sm:text-base"
          >
            <RotateCcw size={16} />
            Làm lại
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 bg-gray-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-700 font-medium text-sm sm:text-base"
          >
            <Camera size={16} />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Countdown Overlay */}
      {isCountdownActive && countdown !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-8 text-center mx-4">
            <div className="text-6xl sm:text-8xl font-bold text-blue-600 mb-4 animate-pulse">
              {countdown}
            </div>
            <p className="text-lg sm:text-xl text-gray-700">
              Chuẩn bị bắt đầu Liveness Test...
            </p>
          </div>
        </div>
      )}

      {/* Progress Header */}
      <div className="max-w-4xl mx-auto mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              🔐 Liveness Detection Test
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {isRecording && (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium">
                    Đang ghi video
                  </span>
                </div>
              )}

              {/* Main Control Buttons */}
              {!isStarted && (
                <button
                  onClick={startLivenessTest}
                  className="flex items-center gap-1 sm:gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-sm sm:text-base"
                >
                  🚀 Bắt đầu Liveness Test
                </button>
              )}

              {isStarted && !isComplete && !isCountdownActive && (
                <button
                  onClick={pauseLivenessTest}
                  className="flex items-center gap-1 sm:gap-2 bg-yellow-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-yellow-700 font-medium text-sm sm:text-base"
                >
                  ⏸️ Dừng lại
                </button>
              )}

              {isPaused && (
                <button
                  onClick={resumeLivenessTest}
                  className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
                >
                  ▶️ Tiếp tục
                </button>
              )}

              <button
                onClick={onBack}
                className="flex items-center gap-1 sm:gap-2 bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 font-medium text-sm sm:text-base"
              >
                <Camera size={14} />
                Quay lại
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {(["front", "left", "right"] as const).map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white font-bold text-sm sm:text-base ${
                    currentStep === step
                      ? "bg-blue-600"
                      : capturedAngles[step]
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                >
                  {capturedAngles[step] ? "✓" : index + 1}
                </div>
                <div className="ml-2">
                  <div className="font-medium text-xs sm:text-sm">
                    {step === "front" && "Nhìn thẳng"}
                    {step === "left" && "Quay trái"}
                    {step === "right" && "Quay phải"}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {currentStep === step
                      ? "Đang thực hiện..."
                      : capturedAngles[step]
                      ? "Hoàn thành"
                      : "Chờ thực hiện"}
                  </div>
                </div>
                {index < 2 && (
                  <div
                    className={`w-8 sm:w-16 h-1 mx-2 sm:mx-4 ${
                      capturedAngles[step] ? "bg-green-600" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Overall Progress */}
          <div className="mt-3 sm:mt-4">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
              <span>Tiến độ tổng thể</span>
              <span>
                {Object.values(capturedAngles).filter(Boolean).length}/3
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (Object.values(capturedAngles).filter(Boolean).length / 3) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-700 text-sm sm:text-base">{error}</div>
          <button
            onClick={() => setError(null)}
            className="mt-2 bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-700"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Current Step Screen - Only show when started and countdown is complete */}
      {isStarted && !isCountdownActive && !isPaused && (
        <LivenessStepScreen
          step={currentStep}
          onStepComplete={handleStepComplete}
          onStepFailed={handleStepFailed}
          isModelLoaded={isModelLoaded}
          videoConstraints={videoConstraints}
          webcamRef={webcamRef}
          canvasRef={canvasRef}
          photoCanvasRef={photoCanvasRef}
          isRecording={isRecording}
        />
      )}

      {/* Welcome Screen - Show when not started */}
      {!isStarted && (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="text-4xl sm:text-6xl mb-4">🔐</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Chào mừng đến với Liveness Test
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
            Hệ thống sẽ hướng dẫn bạn thực hiện 3 bước để xác minh liveness:
          </p>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div className="text-xl sm:text-2xl mb-2">👁️</div>
              <h3 className="font-semibold text-blue-800 text-sm sm:text-base">
                Bước 1: Nhìn thẳng
              </h3>
              <p className="text-xs sm:text-sm text-blue-600">
                Nhìn thẳng vào camera trong 3 giây
              </p>
            </div>
            <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
              <div className="text-xl sm:text-2xl mb-2">👈</div>
              <h3 className="font-semibold text-green-800 text-sm sm:text-base">
                Bước 2: Quay trái
              </h3>
              <p className="text-xs sm:text-sm text-green-600">
                Quay đầu sang trái trong 3 giây
              </p>
            </div>
            <div className="p-3 sm:p-4 bg-purple-50 rounded-lg">
              <div className="text-xl sm:text-2xl mb-2">👉</div>
              <h3 className="font-semibold text-purple-800 text-sm sm:text-base">
                Bước 3: Quay phải
              </h3>
              <p className="text-xs sm:text-sm text-purple-600">
                Quay đầu sang phải trong 3 giây
              </p>
            </div>
          </div>
          <button
            onClick={startLivenessTest}
            className="flex items-center gap-2 bg-green-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-green-700 font-medium text-base sm:text-lg mx-auto"
          >
            🚀 Bắt đầu Liveness Test
          </button>
        </div>
      )}

      {/* Paused Screen */}
      {isPaused && (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="text-4xl sm:text-6xl mb-4">⏸️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Liveness Test đã tạm dừng
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
            Bạn có thể tiếp tục hoặc làm lại từ đầu
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={resumeLivenessTest}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
            >
              ▶️ Tiếp tục
            </button>
            <button
              onClick={resetFlow}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-700 font-medium text-sm sm:text-base"
            >
              🔄 Làm lại từ đầu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivenessFlow;
