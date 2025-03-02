"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";

interface GeminiResponse {
  parsedResume: {
    name: string;
    yoe: string;
    skills: string;
    education: string;
    workExperiences: Array<{
      title: string;
      company: string;
      description: string;
    }>;
    projects: string;
    certifications: string;
    languages: string;
    contact: string;
  };
  analysis: {
    strengths: string[];
    improvements: string[];
    keyHighlights: string[];
  };
}

export async function analyzeResumeWithGemini(
  apiKey: string,
  resumeText: string
): Promise<GeminiResponse> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
  Analyze the following resume text and extract structured information. 
  Also provide an analysis of the resume's strengths and areas for improvement.
  
  RESUME TEXT:
  ${resumeText}
  
  Return your response as a JSON object with the following structure:
  {
    "parsedResume": {
      "name": "Full name of the candidate",
      "yoe": "Years of experience (if found)",
      "skills": "List of skills",
      "education": "Education details",
      "workExperiences": [
        {
          "id": "number",
          "jobTitle": "Job title",
          "employer": "Company name",
          "description": "Job description",
          "startDate": "Start date",
          "endDate": "End date",
          "current": "Boolean value if currently working"
        }
      ],
      "projects": "Projects information, every project should have a title and description with bullet points (do not include title and description)",
      "certifications": "Any certifications",
      "languages": "Languages known",
      "contact": "Contact information (simple text)"
    }
  }
  
  Ensure your response is strictly in valid JSON format.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch =
      text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
    let jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

    jsonString = jsonString.replace(/```json|```/g, "").trim();

    const parsedResponse = JSON.parse(jsonString) as GeminiResponse;
    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing resume with Gemini:", error);
    throw new Error("Failed to analyze resume with Gemini AI");
  }
}
