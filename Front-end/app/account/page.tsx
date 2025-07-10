"use client";
import React, { useRef, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useChatStore } from '../context/ChatStore';

export default function AccountPage() {
  // Mock user info for now
  const userPlan = useChatStore((s) => s.userPlan);
  const [email, setEmail] = useState('user@example.com');
  const [credits, setCredits] = useState(100);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editMode, setEditMode] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">Your Profile</h1>
        <div className="mb-6 relative">
          <Avatar className="h-24 w-24">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="User avatar" />
            ) : (
              <AvatarFallback>U</AvatarFallback>
            )}
          </Avatar>
          <button
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change avatar"
            type="button"
          >
            <span className="text-xs">Edit</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="w-full space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            {editMode ? (
              <input
                className="w-full p-2 border rounded text-gray-700 bg-gray-100"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            ) : (
              <div className="p-2 bg-gray-100 rounded">{email}</div>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Plan</label>
            <div className="p-2 bg-gray-100 rounded capitalize">{userPlan}</div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Credits</label>
            {editMode ? (
              <input
                className="w-full p-2 border rounded text-gray-700 bg-gray-100"
                type="number"
                value={credits}
                onChange={e => setCredits(Number(e.target.value))}
              />
            ) : (
              <div className="p-2 bg-gray-100 rounded">{credits}</div>
            )}
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          {editMode ? (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setEditMode(false)}
            >Save</button>
          ) : (
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
              onClick={() => setEditMode(true)}
            >Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
} 