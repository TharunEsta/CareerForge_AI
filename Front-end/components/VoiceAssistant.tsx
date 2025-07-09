"use client";

"use client";

"use client";

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

const VoiceAssistant: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="text-center text-lg text-gray-700">
        Voice Assistant UI loaded successfully.
      </div>
      <div className="flex justify-center mt-4">
        <Button>
          <Mic className="w-4 h-4 mr-2" />
          Start
        </Button>
      </div>
    </div>
  );
};

export default VoiceAssistant;
