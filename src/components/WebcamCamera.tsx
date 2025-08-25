import { useRef, useState, useCallback } from "react";
import { Camera, CameraOff, Download, AlertCircle } from "lucide-react";
import Webcam from "react-webcam";

const WebcamCamera = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Camera constraints
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
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
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedPhoto(imageSrc);
      }
    }
  }, []);

  // Download photo
  const downloadPhoto = useCallback(() => {
    if (!capturedPhoto) return;

    const link = document.createElement("a");
    link.download = `webcam-photo-${new Date().getTime()}.jpg`;
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
        errorMessage += "Vui lòng cho phép truy cập camera và thử lại.";
      } else if (error.name === "NotFoundError") {
        errorMessage +=
          "Không tìm thấy camera. Vui lòng kiểm tra kết nối webcam.";
      } else if (error.name === "NotReadableError") {
        errorMessage += "Camera đang được sử dụng bởi ứng dụng khác.";
      } else {
        errorMessage += error.message;
      }
    } else {
      errorMessage += String(error);
    }

    setError(errorMessage);
    setIsCameraOn(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Camera Webcam - React Webcam
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
            Đóng
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
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMediaError={handleUserMediaError}
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <CameraOff size={48} className="mx-auto mb-2" />
                  <p>Camera chưa được bật</p>
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex gap-3">
            {!isCameraOn ? (
              <button
                onClick={startCamera}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Camera size={20} />
                Bật Camera
              </button>
            ) : (
              <>
                <button
                  onClick={stopCamera}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <CameraOff size={20} />
                  Tắt Camera
                </button>
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  📸 Chụp Ảnh
                </button>
              </>
            )}
          </div>

          {/* Camera Info */}
          {isCameraOn && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  Status: <span className="font-medium">Đang hoạt động</span>
                </div>
                <div>
                  Engine: <span className="font-medium">React Webcam</span>
                </div>
                <div>
                  Resolution: <span className="font-medium">640x480</span>
                </div>
                <div>
                  Format: <span className="font-medium">JPEG</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Captured Photo Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Ảnh Đã Chụp</h3>

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
                  <p>Chưa có ảnh nào được chụp</p>
                  <p className="text-sm mt-1">Nhấn "📸 Chụp Ảnh" để chụp</p>
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
              Tải Xuống
            </button>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Hướng dẫn sử dụng:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. Nhấn "Bật Camera" và cho phép truy cập webcam</li>
          <li>2. Camera sẽ hiển thị hình ảnh từ webcam của bạn</li>
          <li>3. Nhấn "📸 Chụp Ảnh" để chụp ảnh</li>
          <li>4. Nhấn "Tải Xuống" để lưu ảnh về máy</li>
          <li>5. Nhấn "Tắt Camera" để dừng camera</li>
        </ul>
      </div>

      {/* Technical Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Sử dụng React Webcam | Xử lý local trên trình duyệt | Hỗ trợ đa nền tảng
      </div>
    </div>
  );
};

export default WebcamCamera;
