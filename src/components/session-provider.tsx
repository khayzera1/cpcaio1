
'use client';

import { AuthProvider } from '@/hooks/use-auth';
import type { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Este componente garante que o AuthProvider e o Toaster sejam renderizados apenas no lado do cliente.
export default function SessionProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);
  
    // Evita hydration mismatch, garantindo que o conteúdo que depende do cliente
    // só seja renderizado após a montagem no cliente.
    if (!mounted) {
      // Pode retornar um loader de página inteira aqui, se desejar
      return null;
    }

  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
