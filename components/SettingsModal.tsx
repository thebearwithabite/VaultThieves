
import React, { useState } from 'react';
import { ApiSettings } from '../types';

interface SettingsModalProps {
  settings: ApiSettings;
  onSave: (settings: ApiSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState<ApiSettings>({...settings});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Engine Configuration</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Keys</h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Gemini (Default)</label>
              <div className="px-3 py-2 bg-slate-950 rounded-lg text-xs text-green-500 font-mono flex items-center space-x-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                <span>Environment Key Loaded Automatically</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">OpenAI API Key</label>
              <input 
                type="password"
                value={localSettings.openaiKey}
                onChange={(e) => setLocalSettings({...localSettings, openaiKey: e.target.value})}
                placeholder="sk-..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Anthropic API Key</label>
              <input 
                type="password"
                value={localSettings.anthropicKey}
                onChange={(e) => setLocalSettings({...localSettings, anthropicKey: e.target.value})}
                placeholder="sk-ant-..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Model Selection</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Gemini Model</label>
                <select 
                  value={localSettings.geminiModel}
                  onChange={(e) => setLocalSettings({...localSettings, geminiModel: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm outline-none"
                >
                  <option value="gemini-3-flash-preview">3 Flash Preview</option>
                  <option value="gemini-3-pro-preview">3 Pro Preview</option>
                  <option value="gemini-2.5-flash-lite-latest">2.5 Flash Lite</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">GPT Model</label>
                <select 
                  value={localSettings.gptModel}
                  onChange={(e) => setLocalSettings({...localSettings, gptModel: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm outline-none"
                >
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 flex space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium transition-colors shadow-lg shadow-indigo-600/20"
            >
              Apply Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
