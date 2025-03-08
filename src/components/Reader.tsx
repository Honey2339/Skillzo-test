"use client";
import { useEffect, useState } from "react";
import pdfToText from "react-pdftotext";
import { useFormStore } from "@/app/(store)/formDataStore";
import { analyzeResumeWithGemini } from "@/lib/LLM";
import "dotenv/config";
import { FormData } from "@/lib/types";
import JsonRenderer from "./JsonRenderer";

export default function Reader({
  file,
  uploadProgress,
  setUploadProgress,
  setUploadStatus,
}: {
  file: File | null;
  uploadProgress: number;
  setUploadProgress: (progress: number) => void;
  setUploadStatus: (status: "idle" | "uploading" | "success" | "error") => void;
}) {
  const { formData, setFormData } = useFormStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractAndAnalyzeText = async (event: any) => {
    const geminiApiKey = "AIzaSyB97hJQt87N5pz20zMYjFNR8cAaBzRyo_o";
    const file = event.target.files[0];
    setIsAnalyzing(true);
    setError(null);
    setUploadStatus("uploading");

    try {
      const extractedText = await pdfToText(file);

      setUploadProgress(10);
      setTimeout(() => {
        setUploadProgress(20);
      }, 700);
      setTimeout(() => {
        setUploadProgress(50);
      }, 500);

      setInterval(() => {
        setUploadProgress(uploadProgress + 90);
      }, 100);

      const geminiResponse = await analyzeResumeWithGemini(
        geminiApiKey,
        extractedText
      );

      setUploadProgress(100);
      setUploadStatus("success");
      setFormData(geminiResponse as unknown);
    } catch (error) {
      console.error("Error in extraction or analysis:", error);
      setError("Failed to process the PDF. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (file) {
      extractAndAnalyzeText({ target: { files: [file] } });
    }
  }, [file]);

  return <></>;
}
