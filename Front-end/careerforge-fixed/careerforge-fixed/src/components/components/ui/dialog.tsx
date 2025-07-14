'use client';
import * as React from 'react';
import {
  Dialog as HeadlessDialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@radix-ui/react-dialog';
export const Dialog = HeadlessDialog;
export { DialogContent, DialogTrigger, DialogTitle };
// Optional: Define your own DialogHeader if needed
export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-1.5 text-center sm:text-left">{children}</div>
);
