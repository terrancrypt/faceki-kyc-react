import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { Camera, RotateCcw, Check, AlertCircle } from "lucide-react";
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
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setError(null);
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📄 {getDocumentTitle()}
        </h2>
        <p className="text-gray-600">{getDocumentInstructions()}</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera View */}
        <div className="relative">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {!capturedImage ? (
              <div className="relative">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full"
                />

                {/* Overlay Guide */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 border-2 border-blue-500 border-dashed rounded-lg">
                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      Khung chụp
                    </div>
                  </div>
                </div>

                {/* Capture Button */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={capturePhoto}
                    disabled={isCapturing}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <Camera size={24} />
                    {isCapturing ? "Đang chụp..." : "Chụp ảnh"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured document"
                  className="w-full"
                />

                {/* Action Buttons */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <button
                    onClick={retakePhoto}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    <RotateCcw size={16} />
                    Chụp lại
                  </button>
                  <button
                    onClick={confirmPhoto}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Check size={16} />
                    Xác nhận
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              📋 Hướng dẫn chụp ảnh
            </h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Đảm bảo giấy tờ nằm gọn trong khung hình</li>
              <li>• Ánh sáng đủ sáng và không bị chói</li>
              <li>• Giấy tờ phải rõ ràng, không bị mờ</li>
              <li>• Không che khuất thông tin quan trọng</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              ⚠️ Lưu ý quan trọng
            </h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• Chỉ hiển thị giấy tờ, không chụp các vật khác</li>
              <li>• Đảm bảo camera ổn định khi chụp</li>
              <li>• Kiểm tra ảnh trước khi xác nhận</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">📊 Tiến độ</h3>
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
              <span className="text-sm text-gray-600">
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
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          ← Quay lại
        </button>

        <div className="text-sm text-gray-500">
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
