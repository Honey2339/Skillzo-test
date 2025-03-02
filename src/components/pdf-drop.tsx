"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, File, CheckCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PDFDropZone({
  file,
  setFile,
  setUploadProgress,
  setUploadStatus,
  uploadStatus,
  uploadProgress,
}: {
  file: File | null;
  setFile: (file: File) => void;
  uploadProgress: number;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  setUploadProgress: (progress: number) => void;
  setUploadStatus: (status: "idle" | "uploading" | "success" | "error") => void;
}) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    if (!file.type.includes("pdf")) {
      setErrorMessage("Please upload a PDF file");
      setUploadStatus("error");
      return false;
    }
    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl shadow-white-900/10">
          <CardContent className="pt-6">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-center mb-6 text-white"
            >
              Upload Your Resume
            </motion.h2>

            <AnimatePresence mode="wait">
              {uploadStatus === "idle" && (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`border-2 border-dashed rounded-lg p-8 transition-all duration-300 ${
                    isDragging
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <motion.div
                      animate={
                        isDragging
                          ? {
                              y: [0, -10, 0],
                              scale: [1, 1.1, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 1,
                        repeat: isDragging ? Number.POSITIVE_INFINITY : 0,
                        repeatType: "loop",
                      }}
                    >
                      <Upload className="h-12 w-12 text-purple-400 mb-4" />
                    </motion.div>
                    <p className="text-lg font-medium mb-2 text-white">
                      Drag & Drop your PDF here
                    </p>
                    <p className="text-sm text-gray-400 mb-4">or</p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="mb-2 bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                    >
                      Select PDF File
                    </Button>
                    <p className="text-xs text-gray-500">
                      Maximum file size: 10MB
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="hidden"
                    />
                  </div>
                </motion.div>
              )}

              {uploadStatus === "uploading" && (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-800 rounded-lg p-6 bg-gray-800/50"
                >
                  <div className="flex items-center mb-4">
                    <File className="h-8 w-8 text-purple-400 mr-3" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">
                        {file?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {file && formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Progress
                      value={uploadProgress}
                      className="h-2 mb-2 bg-gray-700"
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                        style={{
                          width: `${uploadProgress}%`,
                          transition: "width 0.3s ease-in-out",
                        }}
                      />
                    </Progress>
                  </div>
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="text-xs text-right text-purple-300"
                  >
                    Uploading... {uploadProgress}%
                  </motion.p>
                </motion.div>
              )}

              {uploadStatus === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="border border-green-800 bg-green-900/20 rounded-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 15, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">
                        {file?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {file && formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-green-400">
                    File uploaded successfully!
                  </p>
                </motion.div>
              )}

              {uploadStatus === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="border border-red-900 bg-red-900/20 rounded-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <AlertCircle className="h-8 w-8 text-red-400 mr-3" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        Upload Failed
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {(uploadStatus === "success" || uploadStatus === "error") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <Button
                  className="w-full mt-4 cursor-pointer"
                  onClick={() => router.push("/form")}
                >
                  Next
                </Button>
                <Button className="w-full mt-2 bg-purple-600 cursor-pointer hover:bg-purple-700 text-white">
                  Upload Another File
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
