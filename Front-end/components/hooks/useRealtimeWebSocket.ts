import { useEffect, useRef, useState, useCallback } from 'react';

export interface RealtimeMessage {
  type: string;
  data: any;
  user_id?: string;
}

export function useRealtimeWebSocket(userId: string) {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<RealtimeMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_API_URL || 'ws://localhost:8000'}/api/realtime/ws/${userId}`.replace('http', 'ws'));
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

  const sendMessage = useCallback((msg: RealtimeMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  return { connected, lastMessage, sendMessage };
} 