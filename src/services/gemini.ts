import { GoogleGenAI, ThinkingLevel, GenerateContentResponse } from '@google/genai';
import { ModelType } from '../types';

export const getGenAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getPaidGenAI = async () => {
  // @ts-ignore
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY });
  }
  return getGenAI();
};

export const generateImage = async (prompt: string) => {
  const ai = getGenAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

const getTonePrompt = (preset: string) => {
  const base = "You are an AI assistant named opencry. Do not introduce yourself unless asked. When someone asks who made you, who created you, or who designed you, make sure it says, \"I was created by opencry ai\".";
  switch (preset) {
    case 'concise': return `${base} Be extremely concise and direct.`;
    case 'creative': return `${base} Be creative, engaging, and expressive.`;
    case 'professional': return `${base} Be highly professional, formal, and structured.`;
    default: return `${base} Be helpful, clear, and natural.`;
  }
};

export const generateTextStream = async function* (
  prompt: string,
  history: { role: string; parts: any[] }[],
  options: {
    model: ModelType;
    isReasoning: boolean;
    isDeepSearch: boolean;
    attachments: any[];
    presetTone: string;
  }
) {
  const ai = getGenAI();
  let modelName = options.model === 'opencry 1.2 max' ? 'gemini-3.1-pro-preview' : 'gemini-2.5-flash-lite';
  
  let config: any = {
    systemInstruction: getTonePrompt(options.presetTone),
  };

  if (options.isReasoning) {
    modelName = 'gemini-3.1-pro-preview';
    config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
  } else if (options.isDeepSearch) {
    modelName = 'gemini-3-flash-preview';
    config.tools = [{ googleSearch: {} }];
  } else if (options.attachments.length > 0) {
    modelName = 'gemini-3.1-pro-preview';
  }

  const parts = [];
  for (const att of options.attachments) {
    if (att.data) {
      parts.push({
        inlineData: {
          data: att.data.split(',')[1] || att.data,
          mimeType: att.mimeType,
        },
      });
    }
  }
  if (prompt) {
    parts.push({ text: prompt });
  }

  const chat = ai.chats.create({
    model: modelName,
    config,
    history: history.map(h => ({
      role: h.role,
      parts: h.parts,
    })),
  });

  const stream = await chat.sendMessageStream({ message: parts });
  for await (const chunk of stream) {
    yield chunk as GenerateContentResponse;
  }
};
