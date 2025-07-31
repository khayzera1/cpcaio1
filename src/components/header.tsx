'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, isLoading, signOutUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/login');
  }
  
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-20">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : user ? (
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:inline">Olá, {user.email}</span>
                <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sair">
                    <LogOut className="h-4 w-4"/>
                </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
