import { GoogleGenAI, Type } from "@google/genai";
import { EquipmentCategory, Condition } from './types.ts';

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI Listing Assistant: Analyze an image to suggest listing details.
 */
export async function analyzeEquipmentImage(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analyze this surveying equipment. Suggest a professional title, identify its category, estimate its condition, and provide a technical description. Also suggest a fair market sale price and a daily rental price in USD." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING, description: "One of: Total Stations, GNSS/GPS, Drones/UAV, Laser Levels, Tripods & Accessories" },
            condition: { type: Type.STRING, description: "One of: New, Like New, Excellent, Good, Fair" },
            description: { type: Type.STRING },
            suggestedSalePrice: { type: Type.NUMBER },
            suggestedRentalDaily: { type: Type.NUMBER },
            specs: {
              type: Type.OBJECT,
              properties: {
                brand: { type: Type.STRING },
                model: { type: Type.STRING }
              }
            }
          },
          required: ["title", "category", "condition", "description"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
}

/**
 * Smart Search: Parse natural language queries into structured filters.
 */
export async function parseSmartSearch(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse this search query for surveying equipment: "${query}". Identify the desired equipment type, maximum price, preferred transaction type (buy/rent), and any specific brands.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            maxPrice: { type: Type.NUMBER },
            transactionType: { type: Type.STRING },
            brand: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Smart search parsing failed:", error);
    return null;
  }
}