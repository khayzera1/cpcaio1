
'use client';

import { AuthProvider, AuthGuard } from '@/hooks/use-auth';
import type { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";

// This component wraps the app with all necessary client-side providers.
export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        {children}
      </AuthGuard>
      <Toaster />
    </AuthProvider>
  );
}
