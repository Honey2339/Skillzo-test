"use client";
import { useState } from "react";
import PDFDropZone from "../components/pdf-drop";

type formData = {
  name: string;
  yoe: string;
  skills: string;
  education: string;
  workExperiences: string[];
  projects: string;
  certifications: string;
  languages: string;
  contact: string;
};

export default function Home() {
  const [fileData, setFileData] = useState<formData>({
    name: "",
    yoe: "",
    skills: "",
    education: "",
    workExperiences: [],
    projects: "",
    certifications: "",
    languages: "",
    contact: "",
  });
  return (
    <div>
      <PDFDropZone fileData={fileData} setFileData={setFileData} />
    </div>
  );
}
