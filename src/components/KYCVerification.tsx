import React from 'react';
import FacekiSDK from '@faceki/react-kyc-sdk';
import { FACEKI_CONFIG } from '../config/faceki';

interface KYCVerificationProps {
  link: string;
  onSuccess?: (data: any) => void;
  onFail?: (data: any) => void;
}

const KYCVerification: React.FC<KYCVerificationProps> = ({ 
  link, 
  onSuccess, 
  onFail 
}) => {
  const sdkConfig = {
    link,
    theme: FACEKI_CONFIG.DEFAULT_THEME,
    onSuccess: (data: any) => {
      console.log("KYC verification successful:", data);
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onFail: (data: any) => {
      console.error("KYC verification failed:", data);
      if (onFail) {
        onFail(data);
      }
    },
  };

  return (
    <div className="kyc-container">
      <h2>Xác minh danh tính KYC</h2>
      <FacekiSDK {...sdkConfig} />
    </div>
  );
};

export default KYCVerification;
