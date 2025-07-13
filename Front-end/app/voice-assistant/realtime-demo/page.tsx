import React, { useState } from 'react';
import { useVoiceAssistantWebSocket, VoiceAssistantMessage } from '@/components/hooks/useVoiceAssistantWebSocket';
import WaveformVisualizer from '@/components/ui/WaveformVisualizer';

export default function VoiceAssistantRealtimeDemo() {
  const [userId, setUserId] = useState('demo-user');
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [assistant, setAssistant] = useState('Pandu');
  const [messages, setMessages] = useState<VoiceAssistantMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { connected, lastMessage, sendMessage } = useVoiceAssistantWebSocket(userId);

  React.useEffect(() => {
    if (lastMessage) {
      setMessages((msgs) => [...msgs, lastMessage]);
      // Simulate assistant speaking
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2000);
    }
  }, [lastMessage]);

  const handleSend = () => {
    sendMessage({ text: input, language, assistant_name: assistant });
    setInput('');
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      // Simulate sending voice input
      const voiceText = "Hello, how are you today?";
      setInput(voiceText);
    }, 3000);
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Voice Assistant Real-Time Demo</h1>
      
      {/* Waveform Visualizer */}
      <div className="mb-6">
        <WaveformVisualizer 
          isRecording={isRecording}
          isPlaying={isPlaying}
          className="mb-4"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">User ID:</label>
        <input value={userId} onChange={e => setUserId(e.target.value)} className="border px-2 py-1 rounded w-full" />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Assistant:</label>
        <select value={assistant} onChange={e => setAssistant(e.target.value)} className="border px-2 py-1 rounded w-full">
          <option value="Pandu">Pandu</option>
          <option value="Gammy">Gammy</option>
          <option value="Alex">Alex</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Language:</label>
        <input value={language} onChange={e => setLanguage(e.target.value)} className="border px-2 py-1 rounded w-full" />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Message:</label>
        <input value={input} onChange={e => setInput(e.target.value)} className="border px-2 py-1 rounded w-full" />
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={handleSend} disabled={!connected || !input} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {connected ? 'Send Text' : 'Connect first'}
        </button>
        <button onClick={handleVoiceInput} disabled={!connected || isRecording} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
          {isRecording ? 'Recording...' : 'Voice Input'}
        </button>
      </div>
      <div className="mb-2 text-sm">WebSocket status: {connected ? <span className="text-green-600">Connected</span> : <span className="text-red-600">Disconnected</span>}</div>
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Messages:</h2>
        <div className="bg-gray-100 p-2 rounded text-xs max-h-64 overflow-y-auto">
          {messages.length === 0 && <div className="text-gray-400">No messages yet.</div>}
          {messages.map((msg, i) => (
            <pre key={i} className="mb-2">{JSON.stringify(msg, null, 2)}</pre>
          ))}
        </div>
      </div>
    </div>
  );
} 