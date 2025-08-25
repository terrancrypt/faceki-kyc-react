import React, { useState } from 'react';
import { generateKYCLink, FACEKI_CONFIG } from '../config/faceki';

interface KYCDemoProps {
  onLinkGenerated: (link: string) => void;
}

const KYCDemo: React.FC<KYCDemoProps> = ({ onLinkGenerated }) => {
  const [apiKey, setApiKey] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateKYCLink = async () => {
    if (!apiKey || !referenceId || !redirectUrl) {
      setError(FACEKI_CONFIG.ERROR_MESSAGES.MISSING_PARAMETERS);
      return;
    }

    setLoading(true);
    setError('');

    const result = await generateKYCLink(apiKey, referenceId, redirectUrl);

    if (result.success && result.data) {
      onLinkGenerated(result.data);
      setError('');
    } else {
      setError(result.error || FACEKI_CONFIG.ERROR_MESSAGES.INVALID_LINK);
    }

    setLoading(false);
  };

  return (
    <div className="demo-container">
      <h3>Demo: Tạo KYC Link</h3>
      <p className="demo-description">
        Nhập thông tin để tạo KYC Link từ FACEKI API
      </p>

      <div className="demo-form">
        <div className="input-group">
          <label htmlFor="apiKey">API Key:</label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Nhập FACEKI API Key..."
            className="kyc-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="referenceId">Reference ID:</label>
          <input
            id="referenceId"
            type="text"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            placeholder="Nhập Reference ID..."
            className="kyc-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="redirectUrl">Redirect URL:</label>
          <input
            id="redirectUrl"
            type="url"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            placeholder="https://your-domain.com/callback"
            className="kyc-input"
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerateKYCLink}
          className="btn btn-primary"
          disabled={loading || !apiKey || !referenceId || !redirectUrl}
        >
          {loading ? 'Đang tạo...' : 'Tạo KYC Link'}
        </button>
      </div>

      <div className="demo-info">
        <h4>Lưu ý:</h4>
        <ul>
          <li>API Key có thể lấy từ FACEKI Dashboard</li>
          <li>Reference ID phải là duy nhất cho mỗi lần xác minh</li>
          <li>Redirect URL sẽ được gọi sau khi hoàn thành xác minh</li>
          <li>Đảm bảo Redirect URL có thể truy cập được từ internet</li>
        </ul>
      </div>
    </div>
  );
};

export default KYCDemo;
