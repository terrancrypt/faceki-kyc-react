# Liveness Detection - React App

A React application that provides real-time liveness detection using face-api.js. The app guides users through a series of face movements (front, left, right) to verify they are real people, not photos or videos.

## Features

- 🔐 **Liveness Detection**: Multi-step liveness verification (front, left, right angles)
- 📸 **Camera Access**: Uses react-webcam for reliable camera integration
- 🎬 **Video Recording**: Records the entire liveness flow for verification
- 🖼️ **Photo Capture**: Captures photos at each step of the liveness process
- 💾 **Download Results**: Download captured photos and video recordings
- 🎯 **Face Landmarks**: Visual indicators showing detected faces with confidence scores
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🌐 **CDN Models**: Loads AI models from CDN for faster initial setup

## Technologies Used

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **react-webcam** for camera access
- **face-api.js** for face detection and landmark analysis
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd faceki-liveness-react
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

3. **Follow Liveness Steps**: The app will guide you through three steps:
   - **Front**: Look straight at the camera for 3 seconds
   - **Left**: Turn your head to the left for 3 seconds
   - **Right**: Turn your head to the right for 3 seconds

4. **Complete Verification**: Once all steps are completed, you'll see the results with captured photos and video

## Project Structure

```
src/
├── components/
│   ├── LivenessFlow.tsx           # Main liveness flow component
│   ├── LivenessStepScreen.tsx     # Individual step screen
│   ├── WebcamCamera.tsx           # Basic webcam component
│   ├── WebcamWithFaceDetection.tsx # Webcam with face detection
│   └── VideoProcessingTest.tsx    # Video processing utilities
├── App.tsx                        # Main app component
├── main.tsx                       # App entry point
└── vite-env.d.ts                 # TypeScript declarations
```

## Key Features Explained

### Liveness Detection Flow
- **Multi-step Verification**: Three distinct angles (front, left, right)
- **Countdown Timer**: 3-second countdown before starting each liveness test
- **Stability Detection**: Ensures face position is stable for 3 seconds at each step
- **Real-time Feedback**: Visual indicators show progress and face position
- **Video Recording**: Records the entire session for backend verification

### Face Detection & Analysis
- Uses TinyFaceDetector for fast detection
- Analyzes face landmarks for position accuracy
- Detects face angles and stability
- Shows confidence scores and quality metrics

### Camera Management
- Uses react-webcam for reliable camera access
- Automatic camera permission handling
- Proper cleanup when stopping camera
- Error handling for camera access issues

### Video Processing
- Records high-quality video during liveness flow
- Supports multiple video formats (WebM, MP4)
- Automatic video processing and blob creation
- Download functionality for verification

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

### Liveness Detection Issues
- Ensure good lighting for better detection
- Follow the instructions carefully for each step
- Keep your face centered and stable during each 3-second period
- Make sure only one face is visible in the camera

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### Adding New Features

The app is built with TypeScript and follows React best practices. The main components are:
- `LivenessFlow.tsx` - Orchestrates the entire liveness process
- `LivenessStepScreen.tsx` - Handles individual step detection
- `App.tsx` - Main app component with model loading

## Deployment

### Vercel Deployment

This project is configured for easy deployment on Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

#### Quick Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy with default settings

The project includes:
- `vercel.json` configuration
- Proper build scripts
- TypeScript configuration for production

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
