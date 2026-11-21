
import { GoogleGenAI } from "@google/genai";
import { LLMProvider, Message } from "../types";

export class LLMService {
  private static geminiClient: GoogleGenAI | null = null;

  private static getGemini() {
    if (!this.geminiClient) {
      this.geminiClient = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    }
    return this.geminiClient;
  }

  static async generate(
    provider: LLMProvider,
    prompt: string,
    history: Message[],
    settings: any
  ): Promise<string> {
    switch (provider) {
      case LLMProvider.GEMINI:
        return this.callGemini(prompt, history, settings.geminiModel);
      case LLMProvider.CHATGPT:
        return this.callChatGPT(prompt, history, settings.openaiKey, settings.gptModel);
      case LLMProvider.CLAUDE:
        return this.callClaude(prompt, history, settings.anthropicKey, settings.claudeModel);
      default:
        throw new Error("Unsupported provider");
    }
  }

  private static async callGemini(prompt: string, history: Message[], model: string): Promise<string> {
    const ai = this.getGemini();
    const chat = ai.chats.create({
      model: model || 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are an assistant for Obsidian users. Format your output with clean Markdown, suitable for note-taking. Use headers, bullet points, and callouts where appropriate."
      }
    });

    // Simple implementation for demo purposes - in real usage we'd map history to Gemini format
    const response = await chat.sendMessage({ message: prompt });
    return response.text || "No response from Gemini";
  }

  private static async callChatGPT(prompt: string, history: Message[], apiKey: string, model: string): Promise<string> {
    if (!apiKey) return "Error: OpenAI API Key missing. Please add it in settings.";
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || "gpt-4-turbo",
          messages: [
            { role: "system", content: "You are an assistant helping an Obsidian user. Output clean Markdown." },
            ...history.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: prompt }
          ]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (e: any) {
      return `OpenAI Error: ${e.message}`;
    }
  }

  private static async callClaude(prompt: string, history: Message[], apiKey: string, model: string): Promise<string> {
    if (!apiKey) return "Error: Anthropic API Key missing. Please add it in settings.";
    
    // Note: Calling Anthropic directly from browser usually fails due to CORS 
    // without a proxy. This is a reference implementation.
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model || "claude-3-opus-20240229",
          max_tokens: 4096,
          messages: [
            ...history.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: prompt }
          ]
        })
      });
      const data = await response.json();
      return data.content[0].text;
    } catch (e: any) {
      return `Claude Error: ${e.message}. Note: Anthropic API typically requires a proxy for browser-side calls due to CORS.`;
    }
  }
}
