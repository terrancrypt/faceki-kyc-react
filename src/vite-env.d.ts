/// <reference types="vite/client" />

declare module 'face-api.js' {
    export interface TinyFaceDetectorOptions {
        inputSize?: number;
        scoreThreshold?: number;
    }

    export interface FaceDetection {
        box: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        score: number;
    }

    export interface FaceLandmarks {
        positions: Array<{ x: number; y: number }>;
    }

    export interface FaceExpression {
        [key: string]: number;
    }

    export interface DetectionWithLandmarks {
        detection: FaceDetection;
        landmarks: FaceLandmarks;
    }

    export interface DetectionWithExpressions extends DetectionWithLandmarks {
        expressions: FaceExpression;
    }

    export interface DetectionWithLandmarksAndExpressions extends DetectionWithExpressions {
        landmarks: FaceLandmarks;
    }

    export const nets: {
        tinyFaceDetector: {
            loadFromUri: (uri: string) => Promise<void>;
        };
        faceLandmark68Net: {
            loadFromUri: (uri: string) => Promise<void>;
        };
        faceRecognitionNet: {
            loadFromUri: (uri: string) => Promise<void>;
        };
        faceExpressionNet: {
            loadFromUri: (uri: string) => Promise<void>;
        };
    };

    export class TinyFaceDetectorOptions {
        constructor(options?: { inputSize?: number; scoreThreshold?: number });
    }

    export function matchDimensions(canvas: HTMLCanvasElement, displaySize: { width: number; height: number }): void;
    export function detectAllFaces(input: HTMLVideoElement, options?: TinyFaceDetectorOptions): {
        withFaceLandmarks(): {
            withFaceExpressions(): Promise<DetectionWithLandmarksAndExpressions[]>;
        };
    };
    export function resizeResults(detections: DetectionWithLandmarksAndExpressions[], displaySize: { width: number; height: number }): DetectionWithLandmarksAndExpressions[];

    export const draw: {
        drawFaceLandmarks(canvas: HTMLCanvasElement, detections: DetectionWithLandmarksAndExpressions[]): void;
    };
}
