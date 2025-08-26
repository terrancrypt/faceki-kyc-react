# Luồng KYC với Chụp Ảnh Giấy Tờ và Liveness Test

## Tổng quan

Luồng KYC mới bao gồm 3 bước chính:
1. **Chọn loại giấy tờ** - CCCD/CMND hoặc Hộ chiếu
2. **Chụp ảnh giấy tờ** - Mặt trước và mặt sau (nếu là CCCD/CMND) hoặc trang thông tin (nếu là hộ chiếu)
3. **Liveness Test** - Chụp ảnh khuôn mặt từ 3 góc và ghi video

## Các Component Chính

### 1. `useKYCFlow` Hook
- Quản lý state của toàn bộ luồng KYC
- Xử lý chuyển đổi giữa các bước
- Lưu trữ dữ liệu giấy tờ và liveness

### 2. `DocumentSelection` Component
- Giao diện chọn loại giấy tờ
- Hiển thị thông tin về từng loại giấy tờ
- Hướng dẫn quy trình

### 3. `DocumentCapture` Component
- Giao diện chụp ảnh giấy tờ
- Hướng dẫn chụp ảnh rõ ràng
- Hiển thị tiến độ chụp
- Cho phép chụp lại nếu cần

### 4. `LivenessFlow` Component (đã có sẵn)
- Thực hiện liveness test
- Chụp ảnh từ 3 góc: chính diện, trái, phải
- Ghi video trong quá trình test

### 5. `KYCComplete` Component
- Hiển thị kết quả hoàn thành
- Chỉ hiển thị giấy tờ và ảnh chính diện cho user
- Các dữ liệu khác được ẩn và log trong console

## Dữ liệu Được Thu Thập

### Dữ liệu Hiển Thị Cho User:
- **Giấy tờ**: Mặt trước và mặt sau (CCCD/CMND) hoặc trang thông tin (hộ chiếu)
- **Ảnh chính diện**: Ảnh khuôn mặt nhìn thẳng

### Dữ Liệu Ẩn (Chỉ Log Trong Console):
- **Ảnh liveness khác**: Ảnh quay trái, quay phải
- **Video liveness**: Video ghi lại toàn bộ quá trình liveness test

## Console Log

Khi hoàn thành KYC, các thông tin sau sẽ được log trong console:

```javascript
// Khi chụp giấy tờ
📄 Document front captured: {
  type: "id_card",
  side: "front",
  dataUrl: "data:image/jpeg;base64,...",
  timestamp: "2024-01-01T00:00:00.000Z"
}

// Khi hoàn thành liveness
🎭 Liveness data captured: {
  front: "Captured",
  left: "Captured", 
  right: "Captured",
  video: "Recorded",
  timestamp: "2024-01-01T00:00:00.000Z"
}

// Tổng hợp dữ liệu KYC
🔒 Complete KYC Data (Hidden from UI): {
  document: {
    type: "id_card",
    front: "Captured",
    back: "Captured"
  },
  liveness: {
    front: "Captured",
    left: "Captured",
    right: "Captured", 
    video: "Recorded"
  },
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

## Cách Sử Dụng

1. **Khởi động ứng dụng**:
   ```bash
   npm run dev
   ```

2. **Chọn loại giấy tờ**:
   - CCCD/CMND: Cần chụp mặt trước và mặt sau
   - Hộ chiếu: Chỉ cần chụp trang thông tin

3. **Chụp ảnh giấy tờ**:
   - Đặt giấy tờ vào khung hình
   - Đảm bảo ánh sáng đủ và rõ ràng
   - Chụp và xác nhận

4. **Thực hiện liveness test**:
   - Làm theo hướng dẫn trên màn hình
   - Chụp ảnh từ 3 góc: chính diện, trái, phải
   - Video sẽ được ghi tự động

5. **Xem kết quả**:
   - Chỉ hiển thị giấy tờ và ảnh chính diện
   - Các dữ liệu khác được ẩn
   - Kiểm tra console để xem dữ liệu đầy đủ

## Tính Năng Bổ Sung

- **Tải xuống ảnh**: Có thể tải xuống ảnh giấy tờ và ảnh chính diện
- **Làm lại**: Có thể làm lại toàn bộ quy trình
- **Điều hướng**: Có thể quay lại các bước trước
- **Xử lý lỗi**: Hiển thị thông báo lỗi rõ ràng

## Lưu Ý Bảo Mật

- Dữ liệu nhạy cảm chỉ được log trong console
- Không lưu trữ dữ liệu vĩnh viễn trong ứng dụng
- Cần tích hợp với backend để lưu trữ an toàn
- Tuân thủ các quy định về bảo vệ dữ liệu cá nhân
