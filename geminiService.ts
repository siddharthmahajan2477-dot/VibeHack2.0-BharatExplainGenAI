import { GoogleGenAI } from "@google/genai";
import { ExplanationRequest, DoubtItem, TopicCategory, DifficultyLevel } from "../types";
import { SYSTEM_INSTRUCTION, TRANSLATION_LANGUAGES } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateExplanation = async (request: ExplanationRequest): Promise<string> => {
  const ai = getClient();
  const modelName = 'gemini-2.5-flash';

  const isTourism = request.category === TopicCategory.TOURISM;
  const isChatbot = request.category === TopicCategory.CHATBOT;
  
  // Configure tools only if Tourism category and location is available
  let tools: any[] | undefined = undefined;
  let toolConfig: any | undefined = undefined;

  if (isTourism && request.location) {
    tools = [{ googleMaps: {} }];
    toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: request.location.lat,
          longitude: request.location.lng
        }
      }
    };
  }

  let prompt = '';
  let sysInstruction = SYSTEM_INSTRUCTION;

  if (isChatbot) {
    // Override system instruction for Bhartiya Persona
    sysInstruction = `You are "Bhartiya", a friendly, witty, and knowledgeable Bharat AI companion.
    
    YOUR PERSONA:
    - You are like a helpful knowledgeable friend or "Dost".
    - You use simple Bharat English (Hinglish flavor is okay but keep it professional).
    - You are polite, using terms like "Ji" or "Friend" where appropriate.
    - You answer general queries about daily life in Bharat, culture, advice, or general chat.
    
    GUIDELINES:
    - Keep answers concise and helpful.
    - Use emojis to make it engaging.
    - Avoid complex jargon.
    - If asked about dangerous/illegal things, gently refuse.
    `;

    prompt = `User Query: "${request.topic}"
    
    Answer as Bhartiya. Be helpful and engaging.`;
  } else {
    // Determine specific constraints based on difficulty to ensure variable output length
    let lengthInstruction = "";
    switch (request.difficulty) {
      case DifficultyLevel.SIMPLE:
        lengthInstruction = "STRICT OUTPUT RULE: Keep the answer SHORT (approx 100-150 words). Use very simple vocabulary, everyday analogies, and avoid deep technical details. Explain it like I am 10 years old.";
        break;
      case DifficultyLevel.STUDENT:
        lengthInstruction = "STRICT OUTPUT RULE: Provide a MEDIUM length answer (approx 300 words). Focus on educational value, key points, definitions, and exam-relevant details. Structure with clear bullet points and headings.";
        break;
      case DifficultyLevel.ADVANCED:
        lengthInstruction = "STRICT OUTPUT RULE: Provide a LONG, DETAILED answer (approx 600+ words). Deep dive into nuances, history, specific legal sections/tech specs, pros/cons, and future implications. Comprehensive coverage required.";
        break;
      default:
        lengthInstruction = "Provide a balanced explanation.";
    }

    // Standard Explanation Prompt
    prompt = `
    Please explain the following:
    
    1. Topic: ${request.topic}
    2. Category: ${request.category}
    3. Difficulty: ${request.difficulty}
    
    ${lengthInstruction}

    ${isTourism && request.location ? `4. Context: User is located at Lat: ${request.location.lat}, Lng: ${request.location.lng}. Use the Google Maps tool to find specific places, ratings, and locations if relevant to the topic.` : ''}
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.7,
        tools: tools,
        toolConfig: toolConfig,
      }
    });

    let text = response.text || "";
    
    // Check for Google Maps Grounding Metadata and append links if they exist
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks && groundingChunks.length > 0) {
      const mapLinks: string[] = [];
      
      groundingChunks.forEach((chunk: any) => {
        if (chunk.maps) {
           const title = chunk.maps.title;
           const uri = chunk.maps.uri;
           if (title && uri) {
             mapLinks.push(`- [📍 ${title}](${uri})`);
           }
        }
      });
      
      // Remove duplicates
      const uniqueLinks = Array.from(new Set(mapLinks));

      if (uniqueLinks.length > 0) {
        text += "\n\n### 🗺️ View on Google Maps\n" + uniqueLinks.join("\n");
      }
    }

    if (!text) {
      throw new Error("No content generated");
    }
    return text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const translateText = async (text: string, targetLangCode: string): Promise<string> => {
  const ai = getClient();
  const modelName = 'gemini-2.5-flash';
  
  const targetLang = TRANSLATION_LANGUAGES.find(l => l.code === targetLangCode)?.label || targetLangCode;

  const prompt = `
    Translate the following Markdown content into ${targetLang}.
    
    IMPORTANT INSTRUCTIONS:
    1. Maintain ALL Markdown formatting (headers, bold, lists, links).
    2. Keep the tone natural, helpful, and culturally appropriate for the target language.
    3. Do not translate code blocks, specific proper nouns that shouldn't be translated, or URLs.
    4. Return ONLY the translated content, do not add introductory text like "Here is the translation".
    
    Content to translate:
    ${text}
  `;

  try {
     const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text || "Translation failed.";
  } catch (error) {
    console.error("Translation Error:", error);
    throw error;
  }
};

export const resolveDoubt = async (
  doubt: string,
  topic: string,
  contextExplanation: string,
  history: DoubtItem[]
): Promise<string> => {
  const ai = getClient();
  const modelName = 'gemini-2.5-flash';

  let historyText = "";
  if (history.length > 0) {
    historyText = "Past conversation about this topic:\n" + history.map(h => `User: ${h.question}\nBharatExplain: ${h.answer}`).join("\n") + "\n\n";
  }

  const prompt = `
    Context:
    The user is asking about the topic: "${topic}".
    I have already provided this explanation:
    "${contextExplanation}"
    
    ${historyText}
    
    User's New Doubt: "${doubt}"
    
    Instructions:
    - Answer the doubt clearly and concisely.
    - Maintain the persona of BharatExplain (Simple, Bharat context, Helpful).
    - If the doubt is unrelated to the topic, politely guide them back or answer briefly if simple.
    - Use Bharat examples if applicable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I couldn't generate an answer. Please try again.";
  } catch (error) {
    console.error("Doubt Error:", error);
    throw error;
  }
};