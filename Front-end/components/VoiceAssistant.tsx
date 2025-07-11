'use client';

import React from 'react';

interface VoiceAssistantProps {
  onClose?: () => void;
}

export default function VoiceAssistant({ onClose }: VoiceAssistantProps) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <p className="text-white">Voice Assistant component - Coming soon!</p>
      {onClose && (
        <button onClick={onClose} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Close
        </button>
      )}
    </div>
  );
}
