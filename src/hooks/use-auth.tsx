
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from 'firebase/auth';
import { onAuthChange, signIn, signUp, logOut } from '@/services/auth-service';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInUser: (email: string, password: string) => Promise<any>;
  signUpUser: (email: string, password: string) => Promise<any>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInUser = (email: string, password: string) => {
    return signIn(email, password);
  };

  const signUpUser = (email: string, password: string) => {
    return signUp(email, password);
  };

  const signOutUser = async () => {
    await logOut();
    router.push('/login');
  };

  if (isLoading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {isClient && <Loader2 className="h-16 w-16 text-primary animate-spin" />}
      </div>
    );
  }

  const value = { user, isLoading, signInUser, signUpUser, signOutUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router, isClient]);
  
  if (!isClient || isLoading || !user) {
     return (
      <div className="min-h-screen flex items-center justify-center">
        {isClient && <Loader2 className="h-16 w-16 text-primary animate-spin" />}
      </div>
    );
  }
  
  return <>{children}</>;
}
