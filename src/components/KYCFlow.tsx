import React from "react";
import { useKYCFlow } from "../hooks/useKYCFlow";
import DocumentSelection from "./DocumentSelection";
import DocumentCapture from "./DocumentCapture";
import LivenessFlow from "./LivenessFlow";
import KYCComplete from "./KYCComplete";

interface KYCFlowProps {
  isModelLoaded: boolean;
  videoConstraints: any;
  onBack: () => void;
}

const KYCFlow: React.FC<KYCFlowProps> = ({
  isModelLoaded,
  videoConstraints,
  onBack,
}) => {
  const {
    currentStep,
    documentType,
    documentSide,
    document,
    livenessData,
    selectDocumentType,
    captureDocumentSide,
    completeLiveness,
    resetFlow,
    goBackToDocumentCapture,
  } = useKYCFlow();

  const handleLivenessComplete = (livenessData: {
    front: string | null;
    left: string | null;
    right: string | null;
    video: string | null;
  }) => {
    completeLiveness(livenessData);
  };

  const handleBackToDocumentSelection = () => {
    resetFlow();
  };

  const handleBackToDocumentCapture = () => {
    goBackToDocumentCapture();
  };

  // Render different components based on current step
  switch (currentStep) {
    case "document_selection":
      return (
        <DocumentSelection
          onSelectDocument={selectDocumentType}
          onBack={onBack}
        />
      );

    case "document_capture":
      if (!documentType) {
        return (
          <div className="text-center p-8">
            <p>Lỗi: Chưa chọn loại giấy tờ</p>
            <button
              onClick={handleBackToDocumentSelection}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Quay lại chọn giấy tờ
            </button>
          </div>
        );
      }

      return (
        <DocumentCapture
          documentType={documentType}
          documentSide={documentSide}
          onCapture={captureDocumentSide}
          onBack={handleBackToDocumentSelection}
          videoConstraints={videoConstraints}
        />
      );

    case "liveness":
      return (
        <LivenessFlow
          isModelLoaded={isModelLoaded}
          videoConstraints={videoConstraints}
          onComplete={handleLivenessComplete}
          onBack={handleBackToDocumentCapture}
        />
      );

    case "complete":
      return (
        <KYCComplete
          document={document}
          livenessData={livenessData}
          onReset={resetFlow}
          onBack={onBack}
        />
      );

    default:
      return (
        <div className="text-center p-8">
          <p>Lỗi: Bước không xác định</p>
          <button
            onClick={resetFlow}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Bắt đầu lại
          </button>
        </div>
      );
  }
};

export default KYCFlow;
