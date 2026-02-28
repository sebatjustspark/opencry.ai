export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachments?: Attachment[];
  isStreaming?: boolean;
  modelUsed?: string;
  error?: string;
  isReasoning?: boolean;
  imageUrl?: string;
}

export interface Attachment {
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  mimeType: string;
  data?: string; // base64
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  isPrivate?: boolean;
}

export interface Settings {
  presetTone: 'standard' | 'concise' | 'creative' | 'professional';
  alwaysReason: boolean;
  theme: 'light' | 'dark';
}

export type ModelType = 'opencry 1.0' | 'opencry 1.2 max';


