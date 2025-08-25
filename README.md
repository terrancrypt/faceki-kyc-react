# KYC Face Detection Camera - React App

A React application that combines react-webcam for camera access and face-api.js for real-time KYC-suitable face detection. The app provides camera access, KYC face detection, photo capture, and download functionality.

## Features

- 🔍 **KYC Face Detection**: Uses face-api.js with TinyFaceDetector for KYC-suitable face detection
- 📸 **Camera Access**: Uses react-webcam for reliable camera integration
- 🖼️ **Photo Capture**: Capture photos when KYC-suitable faces are detected
- 💾 **Download Photos**: Download captured photos with timestamps
- 🎯 **Face Landmarks**: Visual indicators showing detected faces with confidence scores
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🌐 **CDN Models**: Loads AI models from CDN for faster initial setup

## Technologies Used

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **react-webcam** for camera access
- **face-api.js** for face detection
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd faceki-kyc-react
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

## How to Use

1. **Wait for Model Loading**: The app will automatically load the face detection models from CDN (may take a few minutes on first load)

2. **Enable Camera**: Click "Start Camera" and allow camera access when prompted

3. **KYC Face Detection**: Position your face in the camera view. The app will detect KYC-suitable faces and show green bounding boxes

4. **Capture Photo**: Once a KYC-suitable face is detected, the "📸 Capture Photo" button will be enabled. Click it to capture a photo

5. **Download Photo**: Click "Download" to download the captured photo with timestamp

## Project Structure

```
src/
├── components/
│   └── WebcamWithFaceDetection.tsx  # Main webcam + face detection component
├── App.tsx                          # Main app component
├── main.tsx                         # App entry point
└── vite-env.d.ts                   # TypeScript declarations
```

## Key Features Explained

### KYC Face Detection
- Uses TinyFaceDetector for fast detection
- Detects KYC-suitable faces (reasonably clear and not too tilted)
- Shows confidence scores for each detection
- Displays face landmarks and quality analysis
- Filters out faces that are too small, too tilted, or unclear

### Camera Management
- Uses react-webcam for reliable camera access
- Automatic camera permission handling
- Proper cleanup when stopping camera
- Error handling for camera access issues

### Photo Capture
- Captures high-quality photos when KYC-suitable faces are detected
- Adds timestamps to photos
- Supports download functionality
- Uses canvas for image processing

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

**Note**: Camera access requires HTTPS in production environments.

## Troubleshooting

### Camera Not Working
- Ensure you've granted camera permissions
- Check if another app is using the camera
- Try refreshing the page

### Models Not Loading
- Check your internet connection
- The models are loaded from CDN, so a stable connection is required
- First load may take several minutes

### Performance Issues
- Close other browser tabs using camera
- Ensure good lighting for better detection
- The app runs face detection every 100ms for real-time experience

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### Adding New Features

The app is built with TypeScript and follows React best practices. The main component is `FaceDetectionCamera.tsx` which contains all the face detection logic.

## License

This project is open source and available under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

If you encounter any issues or have questions, please open an issue on the repository.
