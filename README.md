# FACEKI KYC React Integration

Ứng dụng demo tích hợp FACEKI KYC SDK vào React với TypeScript.

## 🚀 Tính năng

- ✅ Tích hợp FACEKI KYC SDK
- ✅ Giao diện người dùng đẹp và hiện đại
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Error handling
- ✅ Customizable theme

## 📦 Cài đặt

```bash
# Clone repository
git clone <your-repo-url>
cd faceki-kyc-react

# Cài đặt dependencies
pnpm install

# Chạy development server
pnpm dev
```

## 🔧 Cấu hình

### 1. Lấy KYC Link từ FACEKI API

Trước khi sử dụng, bạn cần lấy KYC Link từ FACEKI API:

```bash
curl -X POST "https://api.faceki.com/v2/kyc/generate-link" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "referenceId": "unique-reference-id",
    "redirectUrl": "https://your-domain.com/callback"
  }'
```

Response sẽ có dạng:
```json
{
  "responseCode": 0,
  "data": "LINKID",  // Sử dụng giá trị này
  "url": "Verification URL"
}
```

### 2. Sử dụng trong ứng dụng

1. Nhập KYC Link vào ô input
2. Nhấn "Bắt đầu xác minh KYC"
3. Làm theo hướng dẫn trong SDK

## 🎨 Tùy chỉnh Theme

Bạn có thể tùy chỉnh giao diện bằng cách chỉnh sửa `theme` object trong `KYCVerification.tsx`:

```typescript
const sdkConfig = {
  link,
  theme: {
    mainColor: "#FF5733",
    secondaryColor: "#2ECC71",
    backgroundColor: "#F4F4F4",
    cardBackgroundColor: "#FFFFFF",
    headingTextColor: "#333333",
    secondaryTextColor: "#777777",
    // ... các thuộc tính khác
  },
  // ...
};
```

## 📁 Cấu trúc dự án

```
src/
├── components/
│   └── KYCVerification.tsx    # Component chính cho KYC
├── App.tsx                    # Component chính
├── App.css                    # Styles
└── main.tsx                   # Entry point
```

## 🔄 API Callbacks

### onSuccess
Được gọi khi xác minh KYC thành công:

```typescript
const handleKYCSuccess = (data: any) => {
  console.log('KYC verification completed successfully:', data);
  // Xử lý logic khi thành công
};
```

### onFail
Được gọi khi xác minh KYC thất bại:

```typescript
const handleKYCFail = (data: any) => {
  console.log('KYC verification failed:', data);
  // Xử lý logic khi thất bại
};
```

## 🛠️ Scripts

```bash
# Development
pnpm dev

# Build production
pnpm build

# Preview build
pnpm preview

# Lint code
pnpm lint
```

## 📚 Tài liệu tham khảo

- [FACEKI KYC Documentation](https://kycdocv2.faceki.com/web-sdk/react)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🆘 Hỗ trợ

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra [FAQ](https://kycdocv2.faceki.com/need-help/faqs)
2. Tạo issue trên GitHub
3. Liên hệ support: [FACEKI Support](https://kycdocv2.faceki.com/need-help/support)
