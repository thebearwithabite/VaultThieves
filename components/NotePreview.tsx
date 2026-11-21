
import React, { useState, useMemo } from 'react';
import { ObsidianNote } from '../types';
import { marked } from 'marked';

interface NotePreviewProps {
  note: ObsidianNote;
  onClose: () => void;
}

const NotePreview: React.FC<NotePreviewProps> = ({ note, onClose }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const fullMarkdown = useMemo(() => `---
title: ${note.title}
date: ${note.date}
tags: [${note.tags.join(', ')}]
provider: ${note.provider}
model: ${note.model}
source: Obsidian Bridge Multi-Connector
---

${note.content}
`, [note]);

  const htmlContent = useMemo(() => {
    // Basic marked options for safe and standard markdown parsing
    return marked.parse(note.content, {
      gfm: true,
      breaks: true,
    });
  }, [note.content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMarkdown);
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="font-bold text-xl leading-tight text-white">{note.title}</h2>
            <div className="flex space-x-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              <span>{note.date}</span>
              <span>•</span>
              <span className="text-indigo-400">{note.provider}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm transition-all border border-slate-700 group"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span className="text-slate-300 group-hover:text-white">{copyStatus === 'copied' ? 'Copied!' : 'Copy Markdown'}</span>
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm transition-all shadow-lg shadow-indigo-600/20 text-white font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download .md</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#0d1117]">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Obsidian-style Properties View */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-700 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Properties
              </span>
            </div>
            <div className="p-4 grid grid-cols-1 gap-y-3.5">
              <div className="grid grid-cols-[120px_1fr] items-baseline text-sm">
                <span className="text-slate-500 font-medium">title</span>
                <span className="text-slate-200 truncate font-medium">{note.title}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-baseline text-sm">
                <span className="text-slate-500 font-medium">date</span>
                <span className="text-slate-200">{note.date}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-baseline text-sm">
                <span className="text-slate-500 font-medium">tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[11px] font-bold leading-none">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-baseline text-sm">
                <span className="text-slate-500 font-medium">provider</span>
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${note.provider === 'GEMINI' ? 'bg-blue-400' : note.provider === 'CHATGPT' ? 'bg-green-400' : 'bg-orange-400'}`} />
                  <span className="text-slate-200 font-mono text-xs">{note.provider}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rendered Markdown Content using Tailwind Typography */}
          <div 
            className="prose prose-invert prose-slate max-w-none 
              prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-3xl prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-slate-800
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-[1.05rem]
              prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline transition-colors
              prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic
              prose-code:text-indigo-300 prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-2xl prose-pre:rounded-xl
              prose-strong:text-white prose-strong:font-bold
              prose-li:text-slate-300
              prose-img:rounded-2xl prose-img:shadow-2xl"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className="pt-16 pb-8 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[8px] text-slate-500">OB</div>
              <span>Generated via Obsidian Bridge Connector</span>
            </div>
            <span>Model: {note.model}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePreview;
