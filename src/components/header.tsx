'use client';

import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import type { User } from 'firebase/auth';

interface HeaderProps {
    user: User | null | undefined;
    onSignOut: (() => Promise<void>) | undefined;
}

export function Header({ user, onSignOut }: HeaderProps) {
  
  const handleSignOut = async () => {
    if (onSignOut) {
      await onSignOut();
    }
  }
  
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-20">
          {user && (
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:inline">Olá, {user.email}</span>
                <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sair">
                    <LogOut className="h-4 w-4"/>
                </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
