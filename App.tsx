
import React, { useState, useEffect } from 'react';
import { 
  LLMProvider, 
  Message, 
  ApiSettings, 
  ObsidianNote, 
  ChatSession 
} from './types';
import { LLMService } from './services/llmService';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import SettingsModal from './components/SettingsModal';
import NotePreview from './components/NotePreview';
import DocsView from './components/DocsView';

const STORAGE_KEYS = {
  SETTINGS: 'obsidian_bridge_settings',
  SESSIONS: 'obsidian_bridge_sessions',
  NOTES: 'obsidian_bridge_notes'
};

const DEFAULT_SETTINGS: ApiSettings = {
  openaiKey: '',
  anthropicKey: '',
  geminiModel: 'gemini-3-flash-preview',
  gptModel: 'gpt-4o',
  claudeModel: 'claude-3-5-sonnet-latest'
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<ApiSettings>(DEFAULT_SETTINGS);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [savedNotes, setSavedNotes] = useState<ObsidianNote[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewingNoteId, setViewingNoteId] = useState<string | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  
  // Local File System state
  const [vaultHandle, setVaultHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [vaultError, setVaultError] = useState<string | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedSess = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (savedSess) {
      const parsedSess = JSON.parse(savedSess);
      setSessions(parsedSess);
      if (parsedSess.length > 0) setActiveSessionId(parsedSess[0].id);
    } else {
      const initialSess: ChatSession = {
        id: crypto.randomUUID(),
        name: 'Main Bridge',
        messages: [],
        activeProvider: LLMProvider.GEMINI
      };
      setSessions([initialSess]);
      setActiveSessionId(initialSess.id);
    }

    const savedNts = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (savedNts) setSavedNotes(JSON.parse(savedNts));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(savedNotes));
  }, [savedNotes]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const handleMountVault = async () => {
    setVaultError(null);
    
    if (!('showDirectoryPicker' in window)) {
      setVaultError("Your browser doesn't support the File System Access API. Please use Chrome or Edge.");
      return;
    }

    try {
      // @ts-ignore - File System Access API
      const handle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });
      setVaultHandle(handle);
    } catch (err: any) {
      console.error("Vault Mount Error:", err);
      if (err.name === 'SecurityError') {
        setVaultError("Browser Security: Direct folder access is blocked in this preview sandbox. Download individual notes instead.");
      } else if (err.name === 'AbortError') {
        // User cancelled, no need for error message
      } else {
        setVaultError(`Connection Failed: ${err.message}`);
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!activeSession) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    const updatedSession = {
      ...activeSession,
      messages: [...activeSession.messages, userMsg]
    };

    setSessions(prev => prev.map(s => s.id === activeSession.id ? updatedSession : s));

    try {
      const aiResponse = await LLMService.generate(
        activeSession.activeProvider,
        text,
        updatedSession.messages,
        settings
      );

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
        provider: activeSession.activeProvider
      };

      setSessions(prev => prev.map(s => s.id === activeSession.id ? {
        ...s,
        messages: [...s.messages, assistantMsg]
      } : s));
    } catch (err: any) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'system',
        content: `Error: ${err.message}`,
        timestamp: Date.now()
      };
      setSessions(prev => prev.map(s => s.id === activeSession.id ? {
        ...s,
        messages: [...s.messages, errorMsg]
      } : s));
    }
  };

  const saveToObsidian = async (content: string, title?: string) => {
    const safeTitle = (title || 'AI Note ' + Date.now()).replace(/[/\\?%*:|"<>]/g, '-').trim().slice(0, 50);
    const noteId = crypto.randomUUID();
    const date = new Date().toISOString().split('T')[0];
    const provider = activeSession?.activeProvider || LLMProvider.GEMINI;
    const model = provider === LLMProvider.GEMINI ? settings.geminiModel : (provider === LLMProvider.CHATGPT ? settings.gptModel : settings.claudeModel);

    const fullMarkdown = `---
title: ${safeTitle}
date: ${date}
tags: [ai-generated, ${provider.toLowerCase()}]
provider: ${provider}
model: ${model}
---

${content}
`;

    let synced = false;
    // Try writing to local FS if mounted
    if (vaultHandle) {
      try {
        const fileHandle = await vaultHandle.getFileHandle(`${safeTitle}.md`, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(fullMarkdown);
        await writable.close();
        synced = true;
      } catch (err) {
        console.error("FS Write Error", err);
        setVaultError("Failed to write to file. Permission may have expired.");
      }
    }

    // Still save to internal state for previewing in Bridge
    const newNote: ObsidianNote = {
      id: noteId,
      title: safeTitle,
      content: content,
      tags: ['ai-generated', provider.toLowerCase()],
      date,
      provider,
      model
    };
    setSavedNotes(prev => [newNote, ...prev]);
    return synced;
  };

  const createNewSession = () => {
    const newSess: ChatSession = {
      id: crypto.randomUUID(),
      name: `Session ${sessions.length + 1}`,
      messages: [],
      activeProvider: LLMProvider.GEMINI
    };
    setSessions(prev => [...prev, newSess]);
    setActiveSessionId(newSess.id);
    setViewingNoteId(null);
    setIsDocsOpen(false);
  };

  const deleteSession = (id: string) => {
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      <Sidebar 
        sessions={sessions} 
        activeSessionId={activeSessionId}
        onSelectSession={(id) => { setActiveSessionId(id); setIsDocsOpen(false); setViewingNoteId(null); }}
        onCreateSession={createNewSession}
        onDeleteSession={deleteSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDocs={() => { setIsDocsOpen(true); setActiveSessionId(null); setViewingNoteId(null); }}
        savedNotes={savedNotes}
        onSelectNote={(id) => { setViewingNoteId(id); setIsDocsOpen(false); setActiveSessionId(null); }}
        onDeleteNote={(id) => setSavedNotes(prev => prev.filter(n => n.id !== id))}
        vaultName={vaultHandle?.name}
        vaultError={vaultError}
        onMountVault={handleMountVault}
      />

      <main className="flex-1 flex flex-col relative">
        {isDocsOpen ? (
          <DocsView onClose={() => setIsDocsOpen(false)} />
        ) : viewingNoteId ? (
          <NotePreview 
            note={savedNotes.find(n => n.id === viewingNoteId)!} 
            onClose={() => setViewingNoteId(null)}
          />
        ) : (
          <ChatWindow 
            session={activeSession}
            onSendMessage={handleSendMessage}
            onSetProvider={(p) => setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, activeProvider: p } : s))}
            onSaveToObsidian={saveToObsidian}
            vaultMounted={!!vaultHandle}
          />
        )}
      </main>

      {isSettingsOpen && (
        <SettingsModal 
          settings={settings}
          onSave={setSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
