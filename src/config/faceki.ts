// FACEKI API Configuration
export const FACEKI_CONFIG = {
  // API Endpoints
  API_BASE_URL: 'https://api.faceki.com/v2',
  GENERATE_LINK_ENDPOINT: '/kyc/generate-link',
  
  // Default theme configuration
  DEFAULT_THEME: {
    mainColor: "#FF5733",
    secondaryColor: "#2ECC71",
    backgroundColor: "#F4F4F4",
    cardBackgroundColor: "#FFFFFF",
    headingTextColor: "#333333",
    secondaryTextColor: "#777777",
    secondaryBorderColor: "#DDDDDD",
    iconFillColor: "#555555",
    iconBorderColor: "#888888",
    iconTextColor: "#FFFFFF",
    logo: "https://example.com/logo.png",
    disableGuidance: false,
    failedText: "Xác minh thất bại. Vui lòng thử lại.",
    successText: "Xác minh thành công!",
    buttonbg: "#F8B427",
    textBg: "#EFEFEF",
    verificationProcessingText: "Đang xử lý xác minh...",
  },
  
  // Error messages
  ERROR_MESSAGES: {
    INVALID_API_KEY: 'API Key không hợp lệ',
    NETWORK_ERROR: 'Lỗi kết nối mạng',
    INVALID_LINK: 'KYC Link không hợp lệ',
    VERIFICATION_FAILED: 'Xác minh thất bại',
    MISSING_PARAMETERS: 'Thiếu thông tin bắt buộc',
  },
  
  // Success messages
  SUCCESS_MESSAGES: {
    LINK_GENERATED: 'KYC Link đã được tạo thành công',
    VERIFICATION_COMPLETED: 'Xác minh hoàn thành',
  },
};

// Helper functions
export const generateKYCLink = async (
  apiKey: string,
  referenceId: string,
  redirectUrl: string
): Promise<{ success: boolean; data?: string; error?: string }> => {
  try {
    const response = await fetch(`${FACEKI_CONFIG.API_BASE_URL}${FACEKI_CONFIG.GENERATE_LINK_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        referenceId,
        redirectUrl,
      }),
    });

    const data = await response.json();

    if (data.responseCode === 0) {
      return {
        success: true,
        data: data.data,
      };
    } else {
      return {
        success: false,
        error: data.message || FACEKI_CONFIG.ERROR_MESSAGES.INVALID_LINK,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: FACEKI_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
    };
  }
};

// Theme customization helper
export const createCustomTheme = (customTheme: Partial<typeof FACEKI_CONFIG.DEFAULT_THEME>) => {
  return {
    ...FACEKI_CONFIG.DEFAULT_THEME,
    ...customTheme,
  };
};
