
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from 'firebase/auth';
import { onAuthChange, signIn, logOut, signUp } from '@/services/auth-service';
import { Loader2 } from 'lucide-react';

// Context to provide auth state and functions
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInUser: (email: string, password: string) => Promise<any>;
  signUpUser: (email: string, password: string) => Promise<any>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider that will wrap the application
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthChange returns an unsubscribe function
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isLoading,
    signInUser: signIn,
    signUpUser: signUp,
    signOutUser: logOut,
  };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// AuthGuard component to protect routes
export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (!isClient || isLoading) {
      return; // Don't do anything until loading is false and we are on the client
    }

    if (!user && !isPublicPath) {
      router.push('/login');
    } else if (user && isPublicPath) {
      router.push('/');
    }
  }, [user, isLoading, isPublicPath, router, pathname, isClient]);

  // While loading or on the server, show a loader to prevent flicker
  if (isLoading || !isClient) {
     return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  // If we are on a public path, or if the user is authenticated, show the children
  if (isPublicPath || user) {
    return <>{children}</>;
  }

  // Otherwise, the user is not authenticated and on a private page.
  // The useEffect above will redirect, so we show a loader in the meantime.
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-16 w-16 text-primary animate-spin" />
    </div>
  );
}
