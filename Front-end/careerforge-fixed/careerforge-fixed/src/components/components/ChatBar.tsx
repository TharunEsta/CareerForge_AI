'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  Send,
  Paperclip,
  Loader2,
  Search,
  RefreshCw,
  Sparkles,
  Globe,
  AudioLines,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { ChatState, useChatStore, ModelType, PromptTemplate } from '@/app/context/ChatStore';
import { UpgradeModal } from './UpgradeModal';
interface ChatBarProps {
  onSend: (message: string, file?: File) => void;
  loading?: boolean;
export const ChatBar: React.FC<ChatBarProps> = ({ onSend, loading }) => {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  let recognition: any;
  const [userPlan, setUserPlan] = useState('free');
  const [model, setModel] = useState('gpt-3.5');
  const [templates, setTemplates] = useState<any[]>([]);
  const addTemplate = (template: any) => setTemplates([...templates, template]);
  const removeTemplate = (name: string) => setTemplates(templates.filter((t) => t.name !== name));
  const [showUpgrade, setShowUpgrade] = useState(false);
  const modelLabels: Record<ModelType, string> = {
    'gpt-3.5': 'GPT-3.5',
    'gpt-4': 'GPT-4',
    dalle: 'DALL·E',
  };
  const modelIcons: Record<ModelType, React.ReactNode> = {
    'gpt-3.5': <Sparkles size={18} className="text-blue-400" />,
    'gpt-4': <Sparkles size={18} className="text-purple-400" />,
    dalle: <AudioLines size={18} className="text-green-400" />,
  };
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  // Voice recognition setup
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    if (listening) {
      recognition && recognition.stop();
      setListening(false);
      return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setInput(text);
      onSend(text, file || undefined);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  };
  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim(), file || undefined);
      setInput('');
      setFile(null);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(input.trim(), file || undefined);
      setInput('');
      setFile(null);
  };
  // Fix the file handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onSend(`Uploaded file: ${selectedFile.name}`, selectedFile);
  };
  // Implement rephrase logic
  const handleRephrase = () => {
    if (!input.trim()) {
      alert('Please enter some text to rephrase.');
      return;
    // Add rephrase prompt to input
    const rephrasePrompt = `Please rephrase the following text in a clear and professional way: "${input}"`;
    setInput(rephrasePrompt);
    if (inputRef.current) inputRef.current.focus();
  };
  const handleSuggestions = () => {
    // Show prompt suggestions modal
    const suggestions = [
      'Help me write a professional cover letter for a software engineering position',
      'Analyze my resume and suggest improvements for ATS optimization',
      'Help me prepare for a technical interview',
      'Write a follow-up email after a job interview',
      'Help me negotiate a job offer',
      'Create a LinkedIn profile summary',
      'Help me answer "Tell me about yourself" in an interview',
      'Write a resignation letter',
    ];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setInput(randomSuggestion);
    if (inputRef.current) inputRef.current.focus();
  };
  const handleLanguage = () => {
    // Show language/settings modal
    const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
    const currentLang = localStorage.getItem('preferred-language') || 'English';
    const nextLang = languages[(languages.indexOf(currentLang) + 1) % languages.length];
    localStorage.setItem('preferred-language', nextLang);
    alert(`Language changed to ${nextLang}`);
  };
  const handleModelChange = (val: string) => {
    if (userPlan === 'free' && (val === 'gpt-4' || val === 'dalle')) {
      setShowUpgrade(true);
      return;
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
  };
  const handleInsertTemplate = (prompt: string) => {
    setInput(prompt);
    if (inputRef.current) inputRef.current.focus();
  };
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-4 shadow-xl">
        <div className="flex items-center space-x-3">
          {/* File Upload */}
          <button
            className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach file"
            type="button"
          >
            <Paperclip size={20} />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
          </button>
          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Ask me anything about your career..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            {/* File indicator */}
            {file && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                📎
              </div>
            )}
          </div>
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Rephrase */}
            <button
              className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white"
              onClick={handleRephrase}
              aria-label="Rephrase"
              type="button"
            >
              <RefreshCw size={20} />
            </button>
            {/* Suggestions */}
            <button
              className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white"
              onClick={handleSuggestions}
              aria-label="Prompt suggestions"
              type="button"
            >
              <Sparkles size={20} />
            </button>
            {/* Language */}
            <button
              className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white"
              onClick={handleLanguage}
              aria-label="Language or settings"
              type="button"
            >
              <Globe size={20} />
            </button>
            {/* Voice Input */}
            <button
              className={`p-2 rounded-xl transition-colors ${
                listening
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
              }`}
              onClick={handleMicClick}
              aria-label="Voice input"
              type="button"
            >
              <Mic size={20} className={listening ? 'animate-pulse' : ''} />
            </button>
            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-xl transition-all duration-200 ${
                loading || (!input.trim() && !file) || undefined
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              }`}
              onClick={handleSend}
              disabled={loading || (!input.trim() && !file) || undefined}
              aria-label="Send message"
              type="button"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </motion.button>
          </div>
        </div>
        {/* Quick Actions */}
        {!input.trim() && !file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-4 mt-3 pt-3 border-t border-gray-700"
          >
            <button
              onClick={() => setInput('Help me optimize my resume for ATS')}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Resume Optimization
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => setInput('Write a cover letter for a software engineer position')}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Cover Letter
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => setInput('Help me prepare for a technical interview')}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Interview Prep
            </button>
          </motion.div>
        )}
      </div>
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      {/* Model Selector Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition">
            {modelIcons[model]}
            <span className="hidden sm:inline">{modelLabels[model]}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup value={model} onValueChange={handleModelChange}>
            <DropdownMenuRadioItem value="gpt-3.5">GPT-3.5</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="gpt-4" disabled={userPlan === 'free'}>
              GPT-4{' '}
              {userPlan === 'free' && <span className="ml-2 text-xs text-yellow-500">Plus</span>}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dalle" disabled={userPlan === 'free'}>
              DALL·E{' '}
              {userPlan === 'free' && <span className="ml-2 text-xs text-yellow-500">Plus</span>}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Templates Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-2 rounded-full hover:bg-gray-800 transition text-gray-400"
            aria-label="Templates"
            type="button"
          >
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
                <button
                  className="ml-2 text-xs text-red-500 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTemplate(t.name);
                  }}
                >
                  Delete
                </button>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Save Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2">Save Prompt as Template</h3>
            <input
              className="w-full p-2 border rounded mb-4 text-gray-700 bg-gray-100"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name (e.g. Cover Letter for React job)"
              autoFocus
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
              onClick={handleConfirmSave}
              disabled={!templateName.trim()}
            >
              Save
            </button>
            <button
              className="text-gray-500 hover:text-gray-700 text-sm"
              onClick={() => setShowTemplateModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
