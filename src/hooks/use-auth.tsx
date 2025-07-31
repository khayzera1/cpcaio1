'use client';

import { 
    useState, 
    useEffect, 
    createContext, 
    useContext, 
    ReactNode,
    useCallback
} from 'react';
import type { User } from 'firebase/auth';
import { 
    onAuthChange, 
    signIn as signInService, 
    logOut as signOutService, 
    signUp as signUpService 
} from '@/services/auth-service';

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

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const signOutUser = useCallback(async () => {
    try {
      await signOutService();
      // O redirecionamento será tratado pela página ou pelo AuthGuard
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
