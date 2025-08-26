import React from "react";
import { CheckCircle, Download, RotateCcw, EyeOff } from "lucide-react";
import type { DocumentType } from "../hooks/useKYCFlow";

interface KYCCompleteProps {
  document: {
    type: DocumentType;
    front: string | null;
    back: string | null;
  };
  livenessData: {
    front: string | null;
    left: string | null;
    right: string | null;
    video: string | null;
  };
  onReset: () => void;
  onBack: () => void;
}

const KYCComplete: React.FC<KYCCompleteProps> = ({
  document,
  livenessData,
  onReset,
  onBack,
}) => {
  const downloadDocument = (side: "front" | "back") => {
    const imageData = document[side];
    if (!imageData) return;

    const link = window.document.createElement("a");
    link.download = `document-${side}-${new Date().getTime()}.jpg`;
    link.href = imageData;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const downloadLivenessFront = () => {
    if (!livenessData.front) return;

    const link = window.document.createElement("a");
    link.download = `liveness-front-${new Date().getTime()}.jpg`;
    link.href = livenessData.front;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const getDocumentTitle = () => {
    return document.type === "id_card" ? "CCCD/CMND" : "Hộ chiếu";
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 bg-white rounded-lg shadow-lg">
      {/* Success Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-4xl sm:text-6xl mb-4">🎉</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Xác thực KYC thành công!
        </h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Tất cả thông tin đã được thu thập và xác thực thành công
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Document Section */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            📄 {getDocumentTitle()} đã chụp/tải lên
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {/* Front Side */}
            {document.front && (
              <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    {document.type === "id_card"
                      ? "Mặt trước"
                      : "Trang thông tin"}
                  </span>
                  <button
                    onClick={() => downloadDocument("front")}
                    className="flex items-center gap-1 bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700 self-start sm:self-auto"
                  >
                    <Download size={12} />
                    Tải xuống
                  </button>
                </div>
                <img
                  src={document.front}
                  alt="Document front"
                  className="w-full h-32 sm:h-48 object-cover rounded"
                />
              </div>
            )}

            {/* Back Side - Only for ID Card */}
            {document.type === "id_card" && document.back && (
              <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    Mặt sau
                  </span>
                  <button
                    onClick={() => downloadDocument("back")}
                    className="flex items-center gap-1 bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700 self-start sm:self-auto"
                  >
                    <Download size={12} />
                    Tải xuống
                  </button>
                </div>
                <img
                  src={document.back}
                  alt="Document back"
                  className="w-full h-32 sm:h-48 object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>

        {/* Liveness Section - Only show front photo */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            👤 Ảnh chính diện
          </h3>
          {livenessData.front ? (
            <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  Ảnh chính diện
                </span>
                <button
                  onClick={downloadLivenessFront}
                  className="flex items-center gap-1 bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-green-700 self-start sm:self-auto"
                >
                  <Download size={12} />
                  Tải xuống
                </button>
              </div>
              <img
                src={livenessData.front}
                alt="Liveness front"
                className="w-full h-32 sm:h-48 object-cover rounded"
              />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl mb-2">❌</div>
              <p className="text-sm sm:text-base text-gray-600">
                Không có ảnh chính diện
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Data Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-start gap-2 sm:gap-3">
          <EyeOff className="text-yellow-600 mt-0.5" size={18} />
          <div>
            <h4 className="font-medium text-yellow-800 mb-1 text-sm sm:text-base">
              Dữ liệu ẩn đã được lưu
            </h4>
            <p className="text-xs sm:text-sm text-yellow-700">
              Các ảnh liveness khác và video đã được lưu trữ an toàn. Bạn có thể
              xem thông tin chi tiết trong Console của trình duyệt (F12).
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
          📊 Tóm tắt dữ liệu đã thu thập
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={14} />
            <span>Giấy tờ: {document.front ? "✓" : "✗"}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={14} />
            <span>Ảnh chính diện: {livenessData.front ? "✓" : "✗"}</span>
          </div>
          <div className="flex items-center gap-2">
            <EyeOff className="text-gray-500" size={14} />
            <span>Ảnh liveness khác: Ẩn</span>
          </div>
          <div className="flex items-center gap-2">
            <EyeOff className="text-gray-500" size={14} />
            <span>Video liveness: Ẩn</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-700 font-medium text-sm sm:text-base"
        >
          <RotateCcw size={16} />
          Làm lại
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-700 font-medium text-sm sm:text-base"
        >
          <CheckCircle size={16} />
          Hoàn thành
        </button>
      </div>
    </div>
  );
};

export default KYCComplete;
