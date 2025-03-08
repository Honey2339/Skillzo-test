"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { FormData } from "./types";

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
  
  RESUME TEXT:
  ${resumeText}
  
  Return your response as a JSON object which has atributes like name yoe etc.
  Make the first letter of each key uppercase and should be sequencial like first should be name yoe etc. Use meaningful name for keys
  
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

export async function ChatWithAI(
  resumeText: FormData,
  message: string,
  onChunk: (chunk: string) => void
): Promise<string> {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyB97hJQt87N5pz20zMYjFNR8cAaBzRyo_o"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
  You are a professional career coach and resume expert. Analyze the following resume text and provide insightful feedback. 
  
  ### RULES :
  - The whole message should be a Markdown text
  - The message should be plain text with spaces and new lines and proper formatting
  - The message should be professional and encouraging
  - the message should not be more than 200 words
  
  ### Instructions:
  1. **Personalized Resume Feedback**:
     - Highlight strengths in the resume.
     - Identify weaknesses or areas of improvement.
     - Suggest ways to optimize formatting, clarity, or content.
  
  2. **Next Steps for Career Growth**:
     - Suggest potential career paths based on their experience and skills.
     - Recommend certifications, courses, or skills they should develop.
     - If relevant, mention industries or roles where they can excel.
  
  3. **Specific Career Advice**:
     - Provide tailored suggestions on how they can improve job applications.
     - Advise on networking strategies, interview preparation, and personal branding.
     - Offer any additional tips to enhance their career prospects.
  
  4. **Recommend Certification or Training**:
    - Offer tailored recommendations such as skills to develop, certifications to
      pursue, or industries to explore.

  ### Resume Data (As Zustand's State):
  ${JSON.stringify(resumeText)}
  
  Give structured and actionable feedback. Keep it professional yet encouraging.

  Here is what the user asked:
  ${message}
  `;

  try {
    const result = await model.generateContentStream(prompt);
    let fullResponse = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      onChunk(chunkText);
    }

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error chatting with AI:", error);
    throw new Error("Failed to chat with AI");
  }
}
