
'use client';

import { AuthProvider } from '@/hooks/use-auth';
import type { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";

// This component wraps the app with all necessary client-side providers.
export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
