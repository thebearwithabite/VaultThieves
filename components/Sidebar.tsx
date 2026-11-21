
import React from 'react';
import { ChatSession, ObsidianNote } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string) => void;
  onOpenSettings: () => void;
  onOpenDocs: () => void;
  savedNotes: ObsidianNote[];
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  vaultName?: string;
  vaultError?: string | null;
  onMountVault: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, activeSessionId, onSelectSession, onCreateSession, 
  onDeleteSession, onOpenSettings, onOpenDocs, savedNotes, onSelectNote, onDeleteNote,
  vaultName, vaultError, onMountVault
}) => {
  return (
    <aside className="w-64 flex flex-col bg-slate-900 border-r border-slate-800">
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Bridge
        </h1>
        <div className="flex items-center space-x-1">
          <button 
            onClick={onOpenDocs}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
            title="API Documentation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-6">
        {/* Vault Connection Area */}
        <div className="px-2 py-3 bg-slate-950/50 rounded-xl border border-slate-800 mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Vault Sync</span>
            <div className={`w-2 h-2 rounded-full ${vaultName ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-700'}`} />
          </div>
          
          {vaultError && (
            <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-400 italic">
              {vaultError}
            </div>
          )}

          {vaultName ? (
            <div className="text-xs space-y-1">
              <div className="text-slate-400 font-medium truncate">Connected to:</div>
              <div className="text-indigo-400 font-mono truncate">{vaultName}</div>
            </div>
          ) : (
            <button 
              onClick={onMountVault}
              className="w-full py-1.5 px-3 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-xs font-bold transition-all border border-indigo-600/20 flex items-center justify-center space-x-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Mount Local Vault</span>
            </button>
          )}
        </div>

        <div>
          <div className="px-2 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Connections</span>
            <button 
              onClick={onCreateSession}
              className="p-1 rounded hover:bg-slate-800 text-slate-400"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div className="space-y-1">
            {sessions.map(s => (
              <div 
                key={s.id}
                onClick={() => onSelectSession(s.id)}
                className={`group px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                  activeSessionId === s.id ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    s.activeProvider === 'GEMINI' ? 'bg-blue-400' : s.activeProvider === 'CHATGPT' ? 'bg-green-400' : 'bg-orange-400'
                  }`} />
                  <span className="truncate text-sm font-medium">{s.name}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-700 text-slate-500"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="px-2 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vault Preview</span>
          </div>
          <div className="space-y-1">
            {savedNotes.length === 0 ? (
              <p className="px-3 text-xs text-slate-600 italic">No notes saved yet.</p>
            ) : (
              savedNotes.map(n => (
                <div 
                  key={n.id}
                  onClick={() => onSelectNote(n.id)}
                  className="group px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors hover:bg-slate-800 text-slate-400"
                >
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="truncate text-sm font-medium">{n.title}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteNote(n.id); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-700 text-slate-500"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            OB
          </div>
          <div>
            <div className="text-sm font-medium">Obsidian Bridge</div>
            <div className="text-xs text-slate-500">v1.1.0 Vault-Sync</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
