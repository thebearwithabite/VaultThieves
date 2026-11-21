
export enum LLMProvider {
  GEMINI = 'GEMINI',
  CHATGPT = 'CHATGPT',
  CLAUDE = 'CLAUDE'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  provider?: LLMProvider;
}

export interface ObsidianNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  provider: LLMProvider;
  model: string;
}

export interface ApiSettings {
  openaiKey: string;
  anthropicKey: string;
  geminiModel: string;
  gptModel: string;
  claudeModel: string;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  activeProvider: LLMProvider;
}
