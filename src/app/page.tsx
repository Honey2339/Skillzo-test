"use client";
import { useState } from "react";
import PDFDropZone from "../components/pdf-drop";
import Reader from "@/components/Reader";

export default function Home() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [file, setFile] = useState<File | null>(null);
  return (
    <div>
      <PDFDropZone
        file={file}
        setFile={setFile}
        uploadStatus={uploadStatus}
        setUploadStatus={setUploadStatus}
        uploadProgress={uploadProgress}
        setUploadProgress={setUploadProgress}
      />
      <Reader
        file={file}
        uploadProgress={uploadProgress}
        setUploadProgress={setUploadProgress}
        setUploadStatus={setUploadStatus}
      />
    </div>
  );
}
