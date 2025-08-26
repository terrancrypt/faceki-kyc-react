import { useState, useCallback } from "react";

export type DocumentType = "id_card" | "passport";
export type DocumentSide = "front" | "back";

interface KYCDocument {
    type: DocumentType;
    front: string | null;
    back: string | null;
}

interface LivenessData {
    front: string | null;
    left: string | null;
    right: string | null;
    video: string | null;
}

interface KYCFlowState {
    currentStep: "document_selection" | "document_capture" | "liveness" | "complete";
    documentType: DocumentType | null;
    documentSide: DocumentSide;
    document: KYCDocument;
    livenessData: LivenessData;
    isComplete: boolean;
    error: string | null;
}

export const useKYCFlow = () => {
    const [state, setState] = useState<KYCFlowState>({
        currentStep: "document_selection",
        documentType: null,
        documentSide: "front",
        document: {
            type: "id_card",
            front: null,
            back: null,
        },
        livenessData: {
            front: null,
            left: null,
            right: null,
            video: null,
        },
        isComplete: false,
        error: null,
    });

    const selectDocumentType = useCallback((type: DocumentType) => {
        setState(prev => ({
            ...prev,
            documentType: type,
            document: {
                ...prev.document,
                type,
            },
            currentStep: "document_capture",
            documentSide: "front",
        }));
    }, []);

    const captureDocumentSide = useCallback((side: DocumentSide, photoData: string) => {
        setState(prev => {
            const newDocument = {
                ...prev.document,
                [side]: photoData,
            };

            // Log the captured document data (hidden from user)
            console.log(`📄 Document ${side} captured:`, {
                type: prev.documentType,
                side,
                dataUrl: photoData.substring(0, 100) + "...", // Truncated for console
                timestamp: new Date().toISOString(),
            });

            // Determine next step and side
            const needsBackSide = prev.documentType === "id_card";
            let nextSide: DocumentSide = "front";
            let nextStep: "document_capture" | "liveness" = "liveness";

            if (side === "front" && needsBackSide) {
                // Just captured front, need to capture back
                nextSide = "back";
                nextStep = "document_capture";
            } else {
                // Either captured back side or passport (no back side needed)
                nextStep = "liveness";
            }

            return {
                ...prev,
                document: newDocument,
                documentSide: nextSide,
                currentStep: nextStep,
            };
        });
    }, []);

    const completeLiveness = useCallback((livenessData: LivenessData) => {
        setState(prev => {
            // Log the liveness data (hidden from user)
            console.log("🎭 Liveness data captured:", {
                front: livenessData.front ? "Captured" : "Missing",
                left: livenessData.left ? "Captured" : "Missing",
                right: livenessData.right ? "Captured" : "Missing",
                video: livenessData.video ? "Recorded" : "Missing",
                timestamp: new Date().toISOString(),
            });

            // Log all hidden data for debugging
            console.log("🔒 Complete KYC Data (Hidden from UI):", {
                document: {
                    type: prev.document.type,
                    front: prev.document.front ? "Captured" : "Missing",
                    back: prev.document.back ? "Captured" : "Missing",
                },
                liveness: {
                    front: livenessData.front ? "Captured" : "Missing",
                    left: livenessData.left ? "Captured" : "Missing",
                    right: livenessData.right ? "Captured" : "Missing",
                    video: livenessData.video ? "Recorded" : "Missing",
                },
                timestamp: new Date().toISOString(),
            });

            return {
                ...prev,
                livenessData,
                currentStep: "complete",
                isComplete: true,
            };
        });
    }, []);

    const resetFlow = useCallback(() => {
        setState({
            currentStep: "document_selection",
            documentType: null,
            documentSide: "front",
            document: {
                type: "id_card",
                front: null,
                back: null,
            },
            livenessData: {
                front: null,
                left: null,
                right: null,
                video: null,
            },
            isComplete: false,
            error: null,
        });
    }, []);

    const goBackToDocumentCapture = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentStep: "document_capture",
            documentSide: "front",
        }));
    }, []);

    const setError = useCallback((error: string | null) => {
        setState(prev => ({
            ...prev,
            error,
        }));
    }, []);

    return {
        // State
        currentStep: state.currentStep,
        documentType: state.documentType,
        documentSide: state.documentSide,
        document: state.document,
        livenessData: state.livenessData,
        isComplete: state.isComplete,
        error: state.error,

        // Actions
        selectDocumentType,
        captureDocumentSide,
        completeLiveness,
        resetFlow,
        goBackToDocumentCapture,
        setError,
    };
};
