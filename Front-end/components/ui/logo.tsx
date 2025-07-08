import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: string;
  variant?: string;
  className?: string;
}

export const Logo = ({ size, variant, className = '' }: LogoProps) => {
  return <div className={`