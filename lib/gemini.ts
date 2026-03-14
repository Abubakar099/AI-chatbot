import { GoogleGenerativeAI } from "@google/generative-ai";

// The constructor takes the string directly: new GoogleGenerativeAI("API_KEY")
if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    'GEMINI_API_KEY environment variable is not set. ' +
    'Please add your Google Gemini API key to .env.local. ' +
    'Get your key from: https://makersuite.google.com/app/apikey'
  );
}

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the latest flash model for speed and cost-efficiency
export const model = ai.getGenerativeModel({ 
  model: "gemini-2.0-flash" 
});
