import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from '../types';

const apiKey = process.env.API_KEY;

// Define the schema for structured JSON output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    productName: {
      type: Type.STRING,
      description: "The name of the product or a generic description if unknown."
    },
    isVegan: {
      type: Type.BOOLEAN,
      description: "Whether the product is suitable for vegans based on the ingredients."
    },
    veganReasoning: {
      type: Type.STRING,
      description: "A short explanation of why it is or isn't vegan (e.g., 'Contains milk powder')."
    },
    detectedAllergens: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of allergies detected. This includes common ones (Peanuts, Gluten, etc.) AND any specific custom allergies requested by the user."
    },
    technicalTerms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          simpleExplanation: { type: Type.STRING, description: "A simplified explanation of what this ingredient is." },
          category: { type: Type.STRING, enum: ['Safe', 'Caution', 'Avoid'], description: "General safety advice or categorization." }
        },
        required: ["term", "simpleExplanation", "category"]
      },
      description: "Explanation of complex chemical names or additives found in the text."
    },
    summary: {
      type: Type.STRING,
      description: "A friendly, concise summary of the analysis for the user."
    }
  },
  required: ["productName", "isVegan", "veganReasoning", "detectedAllergens", "technicalTerms", "summary"]
};

export const analyzeContent = async (
  content: string, 
  isImage: boolean = false, 
  mimeType: string = 'image/jpeg',
  customAllergies: string = ''
): Promise<AnalysisResult> => {
  
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const allergyPrompt = customAllergies 
    ? `2. Detect common allergens (Peanuts, Tree Nuts, Milk/Dairy, Eggs, Soy, Wheat/Gluten, Fish, Shellfish) AND specifically check for these user-defined allergies: "${customAllergies}".`
    : `2. Detect common allergens (Peanuts, Tree Nuts, Milk/Dairy, Eggs, Soy, Wheat/Gluten, Fish, Shellfish).`;

  const promptText = `
    You are a food safety and ingredient expert. 
    Analyze the provided input (either a list of ingredients or an image of a product label).
    
    1. Identify if the product is Vegan.
    ${allergyPrompt}
    3. Identify "technical" or chemical-sounding ingredients (e.g., "Riboflavin", "E471", "Lecithin") and explain them simply to resolve technical confusion.
    4. Provide a helpful summary.
  `;

  try {
    const modelId = "gemini-2.5-flash"; // Efficient for this task
    
    let contentsPayload: any;

    if (isImage) {
      // Content is base64 string excluding the prefix
      contentsPayload = {
        parts: [
          { text: promptText },
          {
            inlineData: {
              mimeType: mimeType,
              data: content
            }
          }
        ]
      };
    } else {
      contentsPayload = {
        parts: [
          { text: promptText + `\n\nHere is the ingredient text to analyze:\n"${content}"` }
        ]
      };
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: contentsPayload,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for factual analysis
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response text received from Gemini.");
    }

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};