
'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export function Header({ children }: { children?: ReactNode }) {
  const { user, signOutUser } = useAuth();
  
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            {children}
          </div>
          {user && (
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Olá, {user.email}</span>
                <Button variant="ghost" size="icon" onClick={signOutUser}>
                    <LogOut className="h-4 w-4"/>
                </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
