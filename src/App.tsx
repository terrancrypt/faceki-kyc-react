import { useState, useEffect } from "react";
import KYCFlow from "./components/KYCFlow";
import { Loader2, AlertCircle } from "lucide-react";
import { useFaceDetection } from "./hooks/useFaceDetection";

function App() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const videoConstraints = {
    width: { ideal: 640, max: 1280 },
    height: { ideal: 480, max: 720 },
    facingMode: "user",
  };

  const { isLoading, error, loadModels } = useFaceDetection();

  useEffect(() => {
    loadModels().then(() => {
      setIsModelLoaded(true);
    });
  }, [loadModels]);

  const handleBack = () => {
    // Reset or navigate back
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <Loader2
            className="animate-spin mx-auto mb-4 text-blue-600"
            size={48}
          />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            Đang tải mô hình nhận diện khuôn mặt...
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            Lỗi tải mô hình
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Xác thực KYC
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            Chụp ảnh giấy tờ và thực hiện liveness test để xác minh danh tính
          </p>
        </div>

        <KYCFlow
          isModelLoaded={isModelLoaded}
          videoConstraints={videoConstraints}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}

export default App;
