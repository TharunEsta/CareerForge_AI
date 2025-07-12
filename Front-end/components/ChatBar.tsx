"use client";
import React, { useRef, useState } from 'react';
import { Mic, Send, Paperclip, Loader2, Search, RefreshCw, Sparkles, Globe, AudioLines } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem } from './ui/dropdown-menu';
import { ChatState, useChatStore, ModelType, PromptTemplate } from '@/app/context/ChatStore';
import { UpgradeModal } from './UpgradeModal';

interface ChatBarProps {
  onSend: (message: string, file?: File) => void;
  loading?: boolean;
}

export const ChatBar: React.FC<ChatBarProps> = ({ onSend, loading }) => {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  let recognition: any;

  const model = useChatStore((s: ChatState) => s.model);
  const setModel = useChatStore((s: ChatState) => s.setModel);
  const userPlan = useChatStore((s: ChatState) => s.userPlan);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const modelLabels: Record<ModelType, string> = {
    'gpt-3.5': 'GPT-3.5',
    'gpt-4': 'GPT-4',
    'dalle': 'DALL·E',
  };
  const modelIcons: Record<ModelType, React.ReactNode> = {
    'gpt-3.5': <Sparkles size={18} className="text-blue-400" />,
    'gpt-4': <Sparkles size={18} className="text-purple-400" />,
    'dalle': <AudioLines size={18} className="text-green-400" />,
  };

  const templates = useChatStore((s: ChatState) => s.templates);
  const addTemplate = useChatStore((s: ChatState) => s.addTemplate);
  const removeTemplate = useChatStore((s: ChatState) => s.removeTemplate);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Voice recognition setup
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    if (listening) {
      recognition && recognition.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      setInput((prev) => prev + event.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  };

  const handleSend = () => {
    if (input.trim() || file) {
      onSend(input.trim(), file || undefined);
      setInput('');
      setFile(null);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Placeholder handlers for rephrase, suggestions, language/settings
  const handleRephrase = () => {
    // TODO: Implement rephrase logic
    alert('Rephrase/Rewrite feature coming soon!');
  };
  const handleSuggestions = () => {
    // TODO: Implement prompt suggestions
    alert('Prompt suggestions coming soon!');
  };
  const handleLanguage = () => {
    // TODO: Implement language/settings
    alert('Language/settings coming soon!');
  };

  const handleModelChange = (val: string) => {
    if (userPlan === 'free' && (val === 'gpt-4' || val === 'dalle')) {
      setShowUpgrade(true);
      return;
    }
    setModel(val as ModelType);
  };

  const handleSaveTemplate = () => {
    setShowTemplateModal(true);
  };
  const handleConfirmSave = () => {
    if (templateName.trim() && input.trim()) {
      addTemplate({ name: templateName.trim(), prompt: input });
      setShowTemplateModal(false);
      setTemplateName('');
    }
  };
  const handleInsertTemplate = (prompt: string) => {
    setInput(prompt);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="fixed bottom-0 left-0 w-full md:w-[calc(100%-16rem)] md:left-64 bg-black/80 border-t border-gray-800 p-4 flex items-center gap-2 z-40 shadow-2xl">
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      {/* Model Selector Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition">
            {modelIcons[model]}<span className="hidden sm:inline">{modelLabels[model]}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup value={model} onValueChange={handleModelChange}>
            <DropdownMenuRadioItem value="gpt-3.5">GPT-3.5</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="gpt-4" disabled={userPlan === 'free'}>GPT-4 {userPlan === 'free' && <span className="ml-2 text-xs text-yellow-500">Plus</span>}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dalle" disabled={userPlan === 'free'}>DALL·E {userPlan === 'free' && <span className="ml-2 text-xs text-yellow-500">Plus</span>}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Search Icon */}
      <button
        className="p-2 rounded-full hover:bg-gray-700 transition text-gray-400"
        aria-label="Search"
        type="button"
      >
        <Search size={22} />
      </button>
      {/* File Upload */}
      <button
        className="p-2 rounded-full hover:bg-gray-700 transition text-gray-400"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Attach file"
        type="button"
      >
        <Paperclip size={22} />
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </button>
      {/* Text Field with embedded actions */}
      <div className="flex-1 flex items-center bg-gray-900 rounded-lg px-2 py-1">
        {/* Templates Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-800 transition text-gray-400" aria-label="Templates" type="button">
              <Sparkles size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {templates.length === 0 ? (
              <DropdownMenuItem disabled>No templates</DropdownMenuItem>
            ) : (
              templates.map((t: PromptTemplate) => (
                <DropdownMenuItem key={t.name} onClick={() => handleInsertTemplate(t.prompt)}>
                  <span className="flex-1">{t.name}</span>
                  <button className="ml-2 text-xs text-red-500 hover:underline" onClick={e => { e.stopPropagation(); removeTemplate(t.name); }}>Delete</button>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent text-white px-2 py-2 focus:outline-none focus:ring-0"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          disabled={loading}
        />
        {/* Save as Template Button */}
        {input.trim() && (
          <button
            className="p-2 rounded-full hover:bg-green-700 transition text-green-400"
            onClick={handleSaveTemplate}
            aria-label="Save as template"
            type="button"
          >
            <span className="hidden sm:inline">Save</span>
            <Sparkles size={20} />
          </button>
        )}
        {/* Rephrase/Rewrite */}
        <button
          className="p-2 rounded-full hover:bg-gray-800 transition text-gray-400"
          onClick={handleRephrase}
          aria-label="Rephrase"
          type="button"
        >
          <RefreshCw size={20} />
        </button>
        {/* Prompt Suggestions/Insights */}
        <button
          className="p-2 rounded-full hover:bg-gray-800 transition text-gray-400"
          onClick={handleSuggestions}
          aria-label="Prompt suggestions"
          type="button"
        >
          <Sparkles size={20} />
        </button>
        {/* Language/Settings */}
        <button
          className="p-2 rounded-full hover:bg-gray-800 transition text-gray-400"
          onClick={handleLanguage}
          aria-label="Language or settings"
          type="button"
        >
          <Globe size={20} />
        </button>
      </div>
      {/* Microphone */}
      <button
        className={`p-2 rounded-full hover:bg-gray-700 transition ${listening ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
        onClick={handleMicClick}
        aria-label="Voice input"
        type="button"
      >
        <Mic size={22} className={listening ? 'animate-pulse' : ''} />
      </button>
      {/* Blue Waveform Button (Submit/Start Chat) */}
      <button
        className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white disabled:opacity-50 shadow-lg"
        onClick={handleSend}
        aria-label="Submit or Start Chat"
        type="button"
        disabled={loading || (!input.trim() && !file)}
      >
        {loading ? <Loader2 size={22} className="animate-spin" /> : <AudioLines size={22} />}
      </button>
      {/* Save Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2">Save Prompt as Template</h3>
            <input
              className="w-full p-2 border rounded mb-4 text-gray-700 bg-gray-100"
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              placeholder="Template name (e.g. Cover Letter for React job)"
              autoFocus
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
              onClick={handleConfirmSave}
              disabled={!templateName.trim()}
            >Save</button>
            <button
              className="text-gray-500 hover:text-gray-700 text-sm"
              onClick={() => setShowTemplateModal(false)}
            >Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}; 
