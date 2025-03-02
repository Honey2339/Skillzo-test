"use client";
import FormPage from "@/components/FormPage";
import React, { useState } from "react";

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

const Form = () => {
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
      <FormPage formData={fileData} setFormData={setFileData} />
    </div>
  );
};

export default Form;
