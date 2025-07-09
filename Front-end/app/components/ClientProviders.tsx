'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../../components/AuthContext';
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
