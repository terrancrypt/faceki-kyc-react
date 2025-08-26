import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import {
  Camera,
  RotateCcw,
  Check,
  AlertCircle,
  SwitchCamera,
  Upload,
} from "lucide-react";
import type { DocumentType, DocumentSide } from "../hooks/useKYCFlow";

interface DocumentCaptureProps {
  documentType: DocumentType;
  documentSide: DocumentSide;
  onCapture: (side: DocumentSide, photoData: string) => void;
  onBack: () => void;
  videoConstraints: any;
}

const DocumentCapture: React.FC<DocumentCaptureProps> = ({
  documentType,
  documentSide,
  onCapture,
  onBack,
  videoConstraints,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBackCamera, setIsBackCamera] = useState(false);
  const [captureMode, setCaptureMode] = useState<"camera" | "upload">("camera");

  // Tạo videoConstraints động dựa trên camera hiện tại
  const currentVideoConstraints = {
    ...videoConstraints,
    facingMode: isBackCamera ? "environment" : "user",
  };

  const toggleCamera = useCallback(() => {
    setIsBackCamera(!isBackCamera);
    setCapturedImage(null); // Reset captured image when switching camera
  }, [isBackCamera]);

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return;

    setIsCapturing(true);
    setError(null);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      } else {
        setError("Không thể chụp ảnh. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Lỗi khi chụp ảnh. Vui lòng thử lại.");
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn file ảnh hợp lệ (JPG, PNG, etc.)");
        return;
      }

      // Kiểm tra kích thước file (tối đa 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setCapturedImage(result);
          setError(null);
        }
      };
      reader.onerror = () => {
        setError("Lỗi khi đọc file ảnh. Vui lòng thử lại.");
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setError(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const confirmPhoto = useCallback(() => {
    if (capturedImage) {
      onCapture(documentSide, capturedImage);
    }
  }, [capturedImage, documentSide, onCapture]);

  const getDocumentInstructions = () => {
    if (documentType === "id_card") {
      return documentSide === "front"
        ? "Đặt mặt trước của CCCD/CMND vào khung hình"
        : "Đặt mặt sau của CCCD/CMND vào khung hình";
    } else {
      return "Đặt trang thông tin của hộ chiếu vào khung hình";
    }
  };

  const getDocumentTitle = () => {
    if (documentType === "id_card") {
      return documentSide === "front"
        ? "Mặt trước CCCD/CMND"
        : "Mặt sau CCCD/CMND";
    } else {
      return "Hộ chiếu";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          📄 {getDocumentTitle()}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          {getDocumentInstructions()}
        </p>
        <div className="mt-2 text-xs sm:text-sm text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 rounded-full inline-block">
          💡 Có thể chụp ảnh hoặc tải lên ảnh có sẵn
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setCaptureMode("camera")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              captureMode === "camera"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            📷 Chụp ảnh
          </button>
          <button
            onClick={() => setCaptureMode("upload")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              captureMode === "upload"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            📁 Tải lên
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700 text-sm sm:text-base">
            <AlertCircle size={18} />
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Camera View or Upload Area */}
        <div className="relative">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {!capturedImage ? (
              <div className="relative">
                {captureMode === "camera" ? (
                  <>
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={currentVideoConstraints}
                      className="w-full h-auto"
                    />

                    {/* Overlay Guide */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-2 sm:inset-4 border-2 border-blue-500 border-dashed rounded-lg">
                        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-blue-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
                          Khung chụp
                        </div>
                      </div>
                    </div>

                    {/* Camera Toggle Button */}
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                      <button
                        onClick={toggleCamera}
                        className="flex items-center gap-1 sm:gap-2 bg-black bg-opacity-50 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-opacity-70 transition-all text-xs sm:text-sm"
                        title={
                          isBackCamera
                            ? "Chuyển sang camera trước"
                            : "Chuyển sang camera sau"
                        }
                      >
                        <SwitchCamera size={16} />
                        <span className="hidden sm:inline">
                          {isBackCamera ? "Camera trước" : "Camera sau"}
                        </span>
                      </button>
                    </div>

                    {/* Capture Button */}
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2">
                      <button
                        onClick={capturePhoto}
                        disabled={isCapturing}
                        className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
                      >
                        <Camera size={20} />
                        {isCapturing ? "Đang chụp..." : "Chụp ảnh"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-8 sm:p-12 text-center">
                    <div className="text-4xl sm:text-6xl mb-4">📁</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                      Tải lên ảnh {getDocumentTitle()}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-4">
                      Chọn ảnh từ thiết bị của bạn
                    </p>
                    <button
                      onClick={triggerFileUpload}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                    >
                      <Upload size={20} />
                      <span>Chọn file ảnh</span>
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                      Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured document"
                  className="w-full h-auto"
                />

                {/* Action Buttons */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <button
                    onClick={retakePhoto}
                    className="flex items-center gap-1 sm:gap-2 bg-gray-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-700 text-xs sm:text-sm"
                  >
                    <RotateCcw size={14} />
                    <span className="hidden sm:inline">
                      {captureMode === "camera" ? "Chụp lại" : "Chọn lại"}
                    </span>
                  </button>
                  <button
                    onClick={confirmPhoto}
                    className="flex items-center gap-1 sm:gap-2 bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-green-700 text-xs sm:text-sm"
                  >
                    <Check size={14} />
                    <span className="hidden sm:inline">Xác nhận</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
              📋 Hướng dẫn {captureMode === "camera" ? "chụp ảnh" : "tải lên"}
            </h3>
            <ul className="text-xs sm:text-sm text-blue-700 space-y-1 sm:space-y-2">
              {captureMode === "camera" ? (
                <>
                  <li>• Đảm bảo giấy tờ nằm gọn trong khung hình</li>
                  <li>• Ánh sáng đủ sáng và không bị chói</li>
                  <li>• Giấy tờ phải rõ ràng, không bị mờ</li>
                  <li>• Không che khuất thông tin quan trọng</li>
                  <li>• Có thể chuyển sang camera sau để chụp rõ hơn</li>
                </>
              ) : (
                <>
                  <li>• Chọn ảnh rõ nét của giấy tờ</li>
                  <li>• Đảm bảo ảnh không bị mờ hoặc thiếu sáng</li>
                  <li>• Thông tin trên giấy tờ phải dễ đọc</li>
                  <li>• Không chọn ảnh có thông tin bị che khuất</li>
                  <li>• File ảnh phải nhỏ hơn 10MB</li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">
              ⚠️ Lưu ý quan trọng
            </h3>
            <ul className="text-xs sm:text-sm text-yellow-700 space-y-1 sm:space-y-2">
              <li>• Chỉ hiển thị giấy tờ, không chụp các vật khác</li>
              <li>• Đảm bảo ảnh ổn định và rõ ràng</li>
              <li>• Kiểm tra ảnh trước khi xác nhận</li>
              {captureMode === "upload" && (
                <li>• Chỉ sử dụng ảnh giấy tờ thật, không dùng ảnh mẫu</li>
              )}
            </ul>
          </div>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
              📊 Tiến độ
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width:
                      documentType === "id_card"
                        ? documentSide === "front"
                          ? "50%"
                          : "100%"
                        : "100%",
                  }}
                ></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-600">
                {documentType === "id_card"
                  ? documentSide === "front"
                    ? "1/2"
                    : "2/2"
                  : "1/1"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {documentType === "id_card"
                ? documentSide === "front"
                  ? "Đã chụp mặt trước"
                  : "Đã chụp mặt sau"
                : "Đã chụp hộ chiếu"}
            </p>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {captureMode === "camera" ? (
                  <>
                    📷 Camera hiện tại:{" "}
                    {isBackCamera ? "Camera sau" : "Camera trước"}
                  </>
                ) : (
                  <>📁 Chế độ: Tải lên ảnh</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Navigation */}
      <div className="flex justify-between mt-4 sm:mt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 text-sm sm:text-base"
        >
          ← Quay lại
        </button>

        <div className="text-xs sm:text-sm text-gray-500">
          Bước{" "}
          {documentType === "id_card"
            ? documentSide === "front"
              ? "1"
              : "2"
            : "1"}{" "}
          - Chụp giấy tờ
        </div>
      </div>
    </div>
  );
};

export default DocumentCapture;
