import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Sparkles } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { SubscriptionModal } from './SubscriptionModal';

interface AskButtonProps {
  onAsk?: (question: string) => void;
  question?: string;
  disabled?: boolean;
  className?: string;
}

export const AskButton: React.FC<AskButtonProps> = ({
  onAsk,
  question = '',
  disabled = false,
  className = '',
}) => {
  const [isAsking, setIsAsking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const { canAsk, updateCredits, setLoading, setError } = useUserStore();

  const handleAsk = async () => {
    if (!question.trim()) return;

    // Check if user can ask
    if (!canAsk()) {
      setShowModal(true);
      return;
    }

    setIsAsking(true);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Deduct credits (mock - in real app, this would be handled by backend)
      const currentCredits = useUserStore.getState().user?.credits || 0;
      updateCredits(Math.max(0, currentCredits - 1));
      
      // Call parent callback
      onAsk?.(question);
      
      console.log('AI response:', data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get AI response');
      console.error('Ask error:', error);
    } finally {
      setIsAsking(false);
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!canAsk()) {
      setShowModal(true);
      return;
    }
    handleAsk();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={disabled || isAsking || !question.trim()}
        className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl px-6 py-3 ${className}`}
      >
        {isAsking ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Asking AI...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            Ask AI
          </div>
        )}
      </Button>

      <SubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type="ask"
      />
    </>
  );
}; 
