import { GoogleGenAI } from "@google/genai";
import { Lead, Deal } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateLeadEmail = async (lead: Lead, context: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const prompt = `
      You are a top-tier sales representative. Write a personalized, professional cold email to a lead.
      
      Lead Name: ${lead.name}
      Company: ${lead.company}
      Source: ${lead.source}
      Context/Goal: ${context}
      
      Keep it concise (under 150 words), engaging, and action-oriented. Return only the email body text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Failed to generate email.";
  } catch (error) {
    console.error("Gemini Email Gen Error:", error);
    return "Error contacting AI service.";
  }
};

export const analyzeDealProbability = async (deal: Deal): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const prompt = `
      Analyze this sales deal and provide a brief risk assessment (1-2 sentences) and a tip to close it.
      
      Deal: ${deal.title}
      Amount: $${deal.amount}
      Stage: ${deal.stage}
      Probability: ${deal.probability}%
      Closing Date: ${deal.closingDate}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error analyzing deal.";
  }
};

export const chatWithCRM = async (query: string, currentViewData: any): Promise<string> => {
    if (!apiKey) return "API Key not configured.";
    
    try {
        const prompt = `
          You are a helpful CRM assistant. Answer the user's query based on the provided context data.
          
          Context Data: ${JSON.stringify(currentViewData).substring(0, 5000)}
          
          User Query: ${query}
          
          Keep the answer helpful and relevant to CRM activities.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        
        return response.text || "I couldn't process that request.";
    } catch (error) {
        console.error("Gemini Chat Error", error);
        return "Sorry, I'm having trouble connecting right now.";
    }
}
