import React from "react";
import { CreditCard, FileText, ArrowRight } from "lucide-react";
import type { DocumentType } from "../hooks/useKYCFlow";

interface DocumentSelectionProps {
  onSelectDocument: (type: DocumentType) => void;
  onBack: () => void;
}

const DocumentSelection: React.FC<DocumentSelectionProps> = ({
  onSelectDocument,
  onBack,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          📄 Chọn loại giấy tờ
        </h2>
        <p className="text-gray-600 text-lg">
          Vui lòng chọn loại giấy tờ bạn muốn sử dụng để xác thực
        </p>
      </div>

      {/* Document Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* CCCD/CMND Option */}
        <div
          onClick={() => onSelectDocument("id_card")}
          className="group cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
        >
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">CCCD/CMND</h3>
            <p className="text-blue-600 mb-4">
              Chứng minh nhân dân hoặc Căn cước công dân
            </p>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Chụp mặt trước và mặt sau</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Thời gian: ~2 phút</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-blue-600 group-hover:text-blue-700">
              <span className="font-medium">Chọn CCCD/CMND</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>

        {/* Passport Option */}
        <div
          onClick={() => onSelectDocument("passport")}
          className="group cursor-pointer bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300"
        >
          <div className="text-center">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <FileText className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Hộ chiếu</h3>
            <p className="text-green-600 mb-4">Hộ chiếu quốc tế</p>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Chụp trang thông tin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Thời gian: ~1 phút</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-green-600 group-hover:text-green-700">
              <span className="font-medium">Chọn Hộ chiếu</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          ℹ️ Thông tin về quy trình
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              1
            </div>
            <div>
              <div className="font-medium text-gray-700">Chụp giấy tờ</div>
              <div>Chụp ảnh giấy tờ tùy thân</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              2
            </div>
            <div>
              <div className="font-medium text-gray-700">Liveness Test</div>
              <div>Xác thực khuôn mặt thật</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              3
            </div>
            <div>
              <div className="font-medium text-gray-700">Hoàn thành</div>
              <div>Xác thực thành công</div>
            </div>
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

        <div className="text-sm text-gray-500">Bước 1 - Chọn giấy tờ</div>
      </div>
    </div>
  );
};

export default DocumentSelection;
