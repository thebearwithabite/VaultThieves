
import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, LLMProvider, Message } from '../types';

interface ChatWindowProps {
  session: ChatSession | null;
  onSendMessage: (text: string) => void;
  onSetProvider: (p: LLMProvider) => void;
  onSaveToObsidian: (content: string, title?: string) => void;
  vaultMounted?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ session, onSendMessage, onSetProvider, onSaveToObsidian, vaultMounted }) => {
  const [inputText, setInputText] = useState('');
  const [showPortalHint, setShowPortalHint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !session) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const openInChatGPT = () => {
    if (!inputText.trim()) return;
    const url = `https://chatgpt.com/?q=${encodeURIComponent(inputText)}`;
    window.open(url, '_blank');
  };

  const openInClaude = () => {
    if (!inputText.trim()) return;
    navigator.clipboard.writeText(inputText);
    setShowPortalHint(true);
    setTimeout(() => setShowPortalHint(false), 3000);
    window.open('https://claude.ai/new', '_blank');
  };

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-slate-400">Select or create a connection to start</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-lg">{session.name}</h2>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            {session.messages.length} notes in thread
          </span>
        </div>
        
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(Object.values(LLMProvider)).map(p => (
            <button 
              key={p}
              onClick={() => onSetProvider(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${session.activeProvider === p ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {p === 'CHATGPT' ? 'GPT' : p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
        {session.messages.length === 0 && (
          <div className="max-w-2xl mx-auto mt-20 text-center space-y-6">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white tracking-tight">The Multi-Model Portal</h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              {vaultMounted ? 
                "Vault is mounted. Any content you save will be written directly to your local Obsidian folder." : 
                "Use the API for instant capture, or the Hosted Portal buttons below for personal context."
              }
            </p>
          </div>
        )}

        {session.messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-[80%] group relative animate-in fade-in slide-in-from-bottom-2 duration-300 ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-3xl rounded-tr-sm px-5 py-3.5 shadow-xl shadow-indigo-900/10' : 'bg-slate-900 border border-slate-800 rounded-3xl rounded-tl-sm px-6 py-5 shadow-sm'}`}>
              
              {m.role === 'assistant' && (
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/50">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${m.provider === 'GEMINI' ? 'bg-blue-400' : m.provider === 'CHATGPT' ? 'bg-green-400' : 'bg-orange-400'}`} />
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">
                      {m.provider || 'AI'} ENGINE
                    </span>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onSaveToObsidian(m.content, m.content.slice(0, 30))}
                      className={`p-1.5 rounded-lg transition-colors flex items-center space-x-1 ${vaultMounted ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'hover:bg-slate-800 text-indigo-400'}`}
                      title={vaultMounted ? "Sync directly to Local Vault" : "Save to Bridge Preview"}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {vaultMounted ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        )}
                      </svg>
                      {vaultMounted && <span className="text-[10px] font-black">SYNC</span>}
                    </button>
                  </div>
                </div>
              )}

              <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 whitespace-pre-wrap mono text-sm leading-relaxed text-slate-300">
                {m.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-slate-950 border-t border-slate-900 relative">
        {showPortalHint && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg animate-bounce">
            Prompt copied! Paste it in Claude's tab.
          </div>
        )}
        
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-4">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Hosted Portals</span>
              <div className="flex space-x-2">
                <button 
                  onClick={openInChatGPT}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[10px] font-bold transition-all border border-emerald-500/20"
                >
                  <span>CHATGPT</span>
                </button>
                <button 
                  onClick={openInClaude}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 text-[10px] font-bold transition-all border border-orange-500/20"
                >
                  <span>CLAUDE</span>
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative group">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={`Send message to ${session.activeProvider.toLowerCase()}...`}
              className="w-full bg-slate-900 border border-slate-800 rounded-3xl px-6 py-5 pr-16 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none min-h-[70px] max-h-[400px] text-slate-200 shadow-2xl"
              rows={1}
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-3.5 bottom-3.5 p-3 rounded-2xl bg-indigo-600 text-white disabled:bg-slate-800 disabled:text-slate-600 transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
