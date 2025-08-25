import { useState } from 'react'
import './App.css'
import KYCVerification from './components/KYCVerification'
import KYCDemo from './components/KYCDemo'

function App() {
  const [showKYC, setShowKYC] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [kycLink, setKycLink] = useState('')
  const [verificationStatus, setVerificationStatus] = useState<string>('')

  const handleKYCSuccess = (data: any) => {
    setVerificationStatus('success')
    console.log('KYC verification completed successfully:', data)
  }

  const handleKYCFail = (data: any) => {
    setVerificationStatus('failed')
    console.log('KYC verification failed:', data)
  }

  const handleStartVerification = () => {
    if (!kycLink.trim()) {
      alert('Vui lòng nhập KYC Link!')
      return
    }
    setShowKYC(true)
    setVerificationStatus('')
  }

  const handleReset = () => {
    setShowKYC(false)
    setShowDemo(false)
    setKycLink('')
    setVerificationStatus('')
  }

  const handleLinkGenerated = (link: string) => {
    setKycLink(link)
    setShowDemo(false)
    setShowKYC(true)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>FACEKI KYC Integration</h1>
        <p>Ứng dụng demo tích hợp FACEKI KYC SDK</p>
      </header>

      <main className="app-main">
        {!showKYC && !showDemo ? (
          <div className="setup-container">
            <div className="input-group">
              <label htmlFor="kycLink">KYC Link:</label>
              <input
                id="kycLink"
                type="text"
                value={kycLink}
                onChange={(e) => setKycLink(e.target.value)}
                placeholder="Nhập KYC Link từ FACEKI API..."
                className="kyc-input"
              />
            </div>
            
            <div className="button-group">
              <button 
                onClick={handleStartVerification}
                className="btn btn-primary"
                disabled={!kycLink.trim()}
              >
                Bắt đầu xác minh KYC
              </button>
            </div>

            <div className="demo-section">
              <h3>Hoặc tạo KYC Link mới:</h3>
              <button 
                onClick={() => setShowDemo(true)}
                className="btn btn-secondary"
              >
                Tạo KYC Link Demo
              </button>
            </div>

            <div className="info-section">
              <h3>Hướng dẫn sử dụng:</h3>
              <ol>
                <li>Lấy KYC Link từ FACEKI API (Generate KYC Link)</li>
                <li>Nhập link vào ô input bên trên</li>
                <li>Hoặc sử dụng "Tạo KYC Link Demo" để tạo link mới</li>
                <li>Nhấn "Bắt đầu xác minh KYC"</li>
                <li>Làm theo hướng dẫn trong SDK để hoàn thành xác minh</li>
              </ol>
            </div>
          </div>
        ) : showDemo ? (
          <div className="demo-section-container">
            <div className="demo-header">
              <button onClick={() => setShowDemo(false)} className="btn btn-secondary">
                ← Quay lại
              </button>
              <h2>Tạo KYC Link Demo</h2>
            </div>
            <KYCDemo onLinkGenerated={handleLinkGenerated} />
          </div>
        ) : (
          <div className="kyc-section">
            <div className="kyc-header">
              <button onClick={handleReset} className="btn btn-secondary">
                ← Quay lại
              </button>
              <h2>Quá trình xác minh KYC</h2>
            </div>
            
            {verificationStatus && (
              <div className={`status-message ${verificationStatus}`}>
                {verificationStatus === 'success' 
                  ? '✅ Xác minh thành công!' 
                  : '❌ Xác minh thất bại!'
                }
              </div>
            )}
            
            <KYCVerification
              link={kycLink}
              onSuccess={handleKYCSuccess}
              onFail={handleKYCFail}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by FACEKI KYC SDK</p>
      </footer>
    </div>
  )
}

export default App
