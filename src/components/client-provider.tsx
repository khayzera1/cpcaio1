
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

const AuthProvider = dynamic(() => import('@/components/auth-provider'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 text-primary animate-spin" />
    </div>
  ),
});

export function ClientProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
