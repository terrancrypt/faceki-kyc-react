import { useState, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";

export const useFaceDetection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const webcamRef = useRef<any>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const photoCanvasRef = useRef<HTMLCanvasElement>(null);

    const loadModels = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model";

            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]);

            return true;
        } catch (error) {
            setError("Failed to load face detection models. Please try again.");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        webcamRef,
        canvasRef,
        photoCanvasRef,
        loadModels,
        setError,
    };
};
