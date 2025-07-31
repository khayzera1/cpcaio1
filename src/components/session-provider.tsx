
'use client';

import { AuthProvider } from '@/hooks/use-auth';
import type { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";
import { Loader2 } from 'lucide-react';

const DynamicAuthProvider = dynamic(
  () => Promise.resolve(AuthProvider),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
         <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    )
  }
);


export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <DynamicAuthProvider>
      {children}
      <Toaster />
    </DynamicAuthProvider>
  );
}
