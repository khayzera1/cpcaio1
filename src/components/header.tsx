'use client';

import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import type { User } from 'firebase/auth';

interface HeaderProps {
    user: User | null;
    onSignOut: () => Promise<void>;
}

export function Header({ user, onSignOut }: HeaderProps) {
  
  const handleSignOut = async () => {
    await onSignOut();
  }
  
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
           <div className="flex items-center gap-2">
             {/* Pode adicionar um logo aqui se quiser */}
           </div>
          {user && (
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:inline">Olá, {user.email}</span>
                <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sair">
                    <LogOut className="h-5 w-5"/>
                </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
