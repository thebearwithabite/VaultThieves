
import React, { useState } from 'react';

type DocSection = 'obsidian' | 'openai' | 'anthropic';

const DocsView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<DocSection>('obsidian');

  const docs = {
    obsidian: {
      title: "Obsidian API (Plugin Development)",
      summary: "Obsidian is a highly extensible local-first knowledge base. Integration usually happens via the Official Obsidian Plugin API or the 'Obsidian URI' system.",
      endpoints: [
        { name: "Create a Note", description: "Use `app.vault.create(path, data)` to create a new markdown file.", code: "await app.vault.create('Notes/My AI Note.md', '# Content');" },
        { name: "Active View", description: "Get the current active markdown editor view.", code: "const view = app.workspace.getActiveViewOfType(MarkdownView);" },
        { name: "YAML Metadata", description: "Use `app.fileManager.processFrontMatter` to modify properties.", code: "app.fileManager.processFrontMatter(file, (fm) => { fm['ai-summary'] = '...'; });" }
      ],
      links: ["https://docs.obsidian.md/", "https://github.com/obsidianmd/obsidian-api"]
    },
    openai: {
      title: "OpenAI API (ChatGPT)",
      summary: "Standard chat completion API used for gpt-4o, gpt-4-turbo, and gpt-3.5-turbo models.",
      endpoints: [
        { name: "Chat Completion", description: "POST request to `/v1/chat/completions`.", code: "fetch('https://api.openai.com/v1/chat/completions', {\n  method: 'POST',\n  headers: { 'Authorization': `Bearer ${KEY}` },\n  body: JSON.stringify({\n    model: 'gpt-4o',\n    messages: [{ role: 'user', content: 'Hello!' }]\n  })\n});" },
        { name: "Structured Outputs", description: "Pass a JSON schema in `response_format` to enforce structure.", code: "response_format: { type: 'json_schema', json_schema: {...} }" }
      ],
      links: ["https://platform.openai.com/docs/api-reference", "https://cookbook.openai.com/"]
    },
    anthropic: {
      title: "Anthropic API (Claude)",
      summary: "High-intelligence LLMs featuring large context windows and strong reasoning.",
      endpoints: [
        { name: "Messages API", description: "The primary way to interact with Claude 3 models.", code: "fetch('https://api.anthropic.com/v1/messages', {\n  method: 'POST',\n  headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },\n  body: JSON.stringify({\n    model: 'claude-3-5-sonnet-latest',\n    max_tokens: 1024,\n    messages: [{ role: 'user', content: 'Hi Claude!' }]\n  })\n});" },
        { name: "System Prompts", description: "Unlike OpenAI, the system prompt is a top-level parameter.", code: "body: JSON.stringify({ system: 'You are a helper.', messages: [...] })" }
      ],
      links: ["https://docs.anthropic.com/claude/reference/", "https://docs.anthropic.com/claude/docs/"]
    }
  };

  const current = docs[activeTab];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="font-bold text-xl uppercase tracking-tighter">Integration Documentation</h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex px-6 pt-4 border-b border-slate-800 space-x-8">
          {(['obsidian', 'openai', 'anthropic'] as DocSection[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 text-sm font-medium transition-all relative ${
                activeTab === tab ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl font-bold text-white">{current.title}</h1>
            <p className="text-slate-400 text-lg leading-relaxed">{current.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {current.endpoints.map((ep, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="text-indigo-400 font-bold mb-1">{ep.name}</h3>
                  <p className="text-sm text-slate-500">{ep.description}</p>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto border border-slate-800">
                  <pre className="text-xs font-mono text-emerald-400"><code>{ep.code}</code></pre>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-8 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resource Links</h4>
            <div className="flex flex-wrap gap-4">
              {current.links.map((link, idx) => (
                <a 
                  key={idx}
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>{new URL(link).hostname}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsView;
