import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { SubscriptionModal } from './SubscriptionModal';

interface UploadButtonProps {
  onFileUpload?: (file: File) => void;
  className?: string;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  onFileUpload,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const { canUpload, incrementUploadCount, setLoading, setError } = useUserStore();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if user can upload
    if (!canUpload()) {
      setShowModal(true);
      return;
    }

    setIsUploading(true);
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Increment upload count
      incrementUploadCount();
      
      // Call parent callback
      onFileUpload?.(file);
      
      console.log('File uploaded successfully:', data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!canUpload()) {
      setShowModal(true);
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isUploading}
        className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl px-6 py-3 ${className}`}
      >
        {isUploading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Uploading...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Upload size={18} />
            Upload File
          </div>
        )}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept=".pdf,.docx,.txt"
        className="hidden"
      />

      <SubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type="upload"
      />
    </>
  );
}; 
