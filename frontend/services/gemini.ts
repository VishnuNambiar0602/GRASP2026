
import { GoogleGenAI, Type } from "@google/genai";

const AI_CONFIG = {
  model: 'gemini-3-flash-preview',
  systemInstruction: `You are a professional medical AI assistant. Your goal is to provide a preliminary assessment of symptoms provided by a user.
  Important Rules:
  1. Always include a clear medical disclaimer.
  2. Be empathetic and professional.
  3. Categorize risk level as Low, Moderate, or High.
  4. Provide 3-5 actionable next steps or recommendations.
  5. Format the response strictly as JSON.`,
};

export const analyzeSymptoms = async (symptoms: string) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('MODEL_NOT_CONFIGURED');
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const contents: any[] = [{ text: `Analyze the following symptoms: ${symptoms}` }];

  try {
    const response = await ai.models.generateContent({
      model: AI_CONFIG.model,
      contents: { parts: contents },
      config: {
        systemInstruction: AI_CONFIG.systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'A concise medical summary of the situation.' },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Actionable steps for the user.'
            }
          },
          required: ['summary', 'riskLevel', 'recommendations']
        }
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
