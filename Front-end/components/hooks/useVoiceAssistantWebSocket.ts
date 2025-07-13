import { useEffect, useRef, useState, useCallback } from 'react';

export interface VoiceAssistantMessage {
  type: string;
  text: string;
  language: string;
  assistant_name: string;
}

export function useVoiceAssistantWebSocket(userId: string) {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<VoiceAssistantMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_API_URL || 'ws://localhost:8000'}/api/voice-assistant/ws/${userId}`.replace('http', 'ws')
    );
    wsRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setLastMessage(msg);
      } catch (e) {
        // ignore
      }
    };
    return () => {
      ws.close();
    };
  }, [userId]);

  const sendMessage = useCallback((msg: { text: string; language?: string; assistant_name?: string }) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          ...msg,
          type: 'voice_message',
        })
      );
    }
  }, []);

  return { connected, lastMessage, sendMessage };
} 