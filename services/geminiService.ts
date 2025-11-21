import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY is not defined");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateCoupleNames = async (name1: string, name2: string): Promise<string[]> => {
    const ai = getClient();

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Create a list of 12 creative, catchy, and fun "ship names" (couple names) by merging '${name1}' and '${name2}'. 
            Mix the syllables, sounds, and letters in different ways. 
            Some should be cute, some funny, and some clever.
            Ensure the names are phonetic and pronounceable.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                },
                temperature: 0.7, // Slightly creative
            },
        });

        if (response.text) {
            const data = JSON.parse(response.text);
            if (Array.isArray(data)) {
                return data;
            }
        }
        return [];
    } catch (error) {
        console.error("Error generating couple names:", error);
        throw error;
    }
};

export const generateLovePrediction = async (shipName: string, name1: string, name2: string): Promise<string> => {
    const ai = getClient();
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a short, whimsical, and funny "astrological" prediction (max 2 sentences) for the couple named "${shipName}" (composed of ${name1} and ${name2}). Make it sound like a playful horoscope.`,
        });
        return response.text || "The stars are aligning for this perfect match!";
    } catch (error) {
        console.error("Error generating prediction", error);
        return "A match made in heaven!";
    }
}