import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Crown } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'upload' | 'ask';
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/pricing');
    onClose();
  };

  const getTitle = () => {
    return type === 'upload' 
      ? "You've reached your upload limit" 
      : "You've reached your credit limit";
  };

  const getDescription = () => {
    return type === 'upload'
      ? "You've used all 5 free uploads. Upgrade to Pro for unlimited uploads and advanced features."
      : "You've used all your free credits. Upgrade to Pro for unlimited AI interactions and priority support.";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/95 backdrop-blur-sm border-white/20 text-gray-900 max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Crown size={24} className="text-white" />
            </div>
            <DialogTitle className="text-xl font-bold">
              {getTitle()}
            </DialogTitle>
          </div>
            {getDescription()}
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Sparkles size={20} className="text-purple-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Unlimited Uploads</h4>
                <p className="text-sm text-gray-600">Upload as many files as you need</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Zap size={20} className="text-purple-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Unlimited Credits</h4>
                <p className="text-sm text-gray-600">Ask unlimited questions to AI</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Crown size={20} className="text-purple-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Priority Support</h4>
                <p className="text-sm text-gray-600">Get help when you need it most</p>
              </div>
            </div>
          </div>
        </div>

          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Maybe Later
          </Button>
          <Button 
            onClick={handleUpgrade}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Get Pro
          </Button>
      </DialogContent>
    </Dialog>
  );
}; 
