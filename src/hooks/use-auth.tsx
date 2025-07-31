
'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { onAuthChange, signIn as signInService, logOut as signOutService, signUp as signUpService } from '@/services/auth-service';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInUser: typeof signInService;
  signUpUser: typeof signUpService;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    await signOutService();
    router.push('/login');
  };

  const value = {
    user,
    isLoading,
    signInUser: signInService,
    signUpUser: signUpService,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This is a fallback for when the hook is used outside of the provider.
    // It will provide the auth functions but user will be null.
    // A better approach is to ensure the hook is always used within the provider.
    return { 
        user: null, 
        isLoading: true, 
        signInUser: signInService, 
        signUpUser: signUpService,
        signOutUser: async () => { await signOutService(); }
    };
  }
  return context;
};

// This component wraps the app with all necessary client-side providers.
// It was removed to simplify the structure and fix build errors.
// The AuthGuard component now handles the protection logic directly.
