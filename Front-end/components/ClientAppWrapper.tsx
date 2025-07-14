'use client';

import { Providers } from './Providers';
import MicroDashboardMenu from './ui/MicroDashboardMenu';
import React from 'react';

export default function ClientAppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <MicroDashboardMenu />
      {children}
    </Providers>
  );
}

