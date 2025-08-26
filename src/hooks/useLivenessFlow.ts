import { useState, useRef, useCallback, useEffect } from "react";

interface UseLivenessFlowProps {
    onComplete: (capturedAngles: {
        front: string | null;
        left: string | null;
        right: string | null;
    }) => void;
}

export const useLivenessFlow = ({ onComplete }: UseLivenessFlowProps) => {
    const [currentStep, setCurrentStep] = useState<"front" | "left" | "right">("front");
    const [capturedAngles, setCapturedAngles] = useState({
        front: null as string | null,
        left: null as string | null,
        right: null as string | null,
    });
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
    const [isVideoProcessing, setIsVideoProcessing] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const countdownStartedRef = useRef(false);
    const mediaRecorderRef = useRef<any>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const videoReadyCallbackRef = useRef<(() => void) | null>(null);

    const startFlowRecording = useCallback(() => {
        const webcam = mediaRecorderRef.current;
        if (!webcam?.stream) return;

        try {
            recordedChunksRef.current = [];

            const supportedTypes = [
                "video/webm;codecs=vp9",
                "video/webm;codecs=vp8",
                "video/webm",
                "video/mp4",
            ];

            let selectedType = null;
            for (const type of supportedTypes) {
                if (MediaRecorder.isTypeSupported(type)) {
                    selectedType = type;
                    break;
                }
            }

            if (!selectedType) return;

            const mediaRecorder = new MediaRecorder(webcam.stream, {
                mimeType: selectedType,
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                setIsVideoProcessing(true);

                setTimeout(() => {
                    try {
                        if (recordedChunksRef.current.length > 0) {
                            const blob = new Blob(recordedChunksRef.current, {
                                type: "video/webm",
                            });
                            const videoURL = URL.createObjectURL(blob);
                            setRecordedVideo(videoURL);
                            setIsVideoProcessing(false);
                            setVideoReady(true);

                            if (videoReadyCallbackRef.current) {
                                videoReadyCallbackRef.current();
                                videoReadyCallbackRef.current = null;
                            }
                        } else {
                            setIsVideoProcessing(false);
                            setVideoReady(false);
                        }
                    } catch (error) {
                        setIsVideoProcessing(false);
                        setVideoReady(false);
                    }
                }, 100);
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            // Handle error silently
        }
    }, []);

    const startCountdown = useCallback(() => {
        if (countdownStartedRef.current) return;

        countdownStartedRef.current = true;
        setIsCountdownActive(true);
        setCountdown(3);

        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(countdownInterval);
                    setIsCountdownActive(false);
                    setCountdown(null);
                    countdownStartedRef.current = false;
                    setTimeout(() => {
                        // Check if webcam ref is ready
                        if (mediaRecorderRef.current?.stream) {
                            startFlowRecording();
                        } else {
                            // Wait a bit more and try again
                            setTimeout(() => {
                                if (mediaRecorderRef.current?.stream) {
                                    startFlowRecording();
                                }
                            }, 500);
                        }
                    }, 100);
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    }, [startFlowRecording]);

    const stopFlowRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            try {
                mediaRecorderRef.current.requestData();
            } catch (error) {
                // Handle error silently
            }

            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const startLivenessTest = useCallback(() => {
        setIsStarted(true);
        setIsPaused(false);
        setError(null);
        startCountdown();
    }, [startCountdown]);

    const restartRecording = useCallback(() => {
        if (mediaRecorderRef.current?.stream) {
            startFlowRecording();
        }
    }, [startFlowRecording]);

    const pauseLivenessTest = useCallback(() => {
        setIsPaused(true);
        setIsCountdownActive(false);
        setCountdown(null);
        countdownStartedRef.current = false;
        stopFlowRecording();
    }, [stopFlowRecording]);

    const resumeLivenessTest = useCallback(() => {
        setIsPaused(false);
        startCountdown();
    }, [startCountdown]);

    const resetFlow = useCallback(() => {
        setCurrentStep("front");
        setCapturedAngles({
            front: null,
            left: null,
            right: null,
        });
        setIsComplete(false);
        setError(null);
        setRecordedVideo(null);
        setIsVideoProcessing(false);
        setVideoReady(false);
        setCountdown(null);
        setIsCountdownActive(false);
        setIsStarted(false);
        setIsPaused(false);
        countdownStartedRef.current = false;
        videoReadyCallbackRef.current = null;
        stopFlowRecording();
    }, [stopFlowRecording]);

    const handleStepComplete = useCallback((
        step: "front" | "left" | "right",
        photoData: string
    ) => {
        setCapturedAngles((prev) => ({
            ...prev,
            [step]: photoData,
        }));

        if (step === "front") {
            setCurrentStep("left");
        } else if (step === "left") {
            setCurrentStep("right");
        } else if (step === "right") {
            stopFlowRecording();
            setIsComplete(true);
            onComplete({
                ...capturedAngles,
                [step]: photoData,
            });
        }
    }, [capturedAngles, onComplete, stopFlowRecording]);

    const handleStepFailed = useCallback((
        step: "front" | "left" | "right",
        errorMessage: string
    ) => {
        setError(`Bước ${step} thất bại: ${errorMessage}`);
    }, []);

    const downloadAllAngles = useCallback(() => {
        Object.entries(capturedAngles).forEach(([angle, photoData]) => {
            if (photoData) {
                const link = document.createElement("a");
                link.download = `liveness-${angle}-${new Date().getTime()}.jpg`;
                link.href = photoData;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }, [capturedAngles]);

    const downloadVideo = useCallback(() => {
        if (!recordedVideo) return;

        const link = document.createElement("a");
        link.download = `liveness-video-${new Date().getTime()}.webm`;
        link.href = recordedVideo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [recordedVideo]);



    return {
        // States
        currentStep,
        capturedAngles,
        isComplete,
        error,
        isRecording,
        recordedVideo,
        isVideoProcessing,
        videoReady,
        countdown,
        isCountdownActive,
        isStarted,
        isPaused,

        // Refs
        mediaRecorderRef,
        recordedChunksRef,
        videoReadyCallbackRef,

        // Actions
        startLivenessTest,
        pauseLivenessTest,
        resumeLivenessTest,
        restartRecording,
        resetFlow,
        handleStepComplete,
        handleStepFailed,
        downloadAllAngles,
        downloadVideo,
        setError,
    };
};
