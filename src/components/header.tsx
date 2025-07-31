
'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { LogOut, Loader2 } from 'lucide-react';

export function Header({ children }: { children?: ReactNode }) {
  const { user, isLoading, signOutUser } = useAuth();
  
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            {children}
          </div>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : user ? (
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:inline">Olá, {user.email}</span>
                <Button variant="ghost" size="icon" onClick={signOutUser} aria-label="Sair">
                    <LogOut className="h-4 w-4"/>
                </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
