
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from 'firebase/auth';
import { onAuthChange, signIn, signUp, logOut } from '@/services/auth-service';
import { Loader2 } from 'lucide-react';
import LoginPage from '@/app/login/page';
import RegisterPage from '@/app/register/page';


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
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
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
    // O redirecionamento pode ser gerenciado pelo AuthGuard
  };
  
  const value = { user, isLoading, signInUser, signUpUser, signOutUser };

  return (
    <AuthContext.Provider value={value}>
        <AuthGuard>{children}</AuthGuard>
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
  const pathname = usePathname();

  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (isLoading) {
      return; // Não faça nada enquanto carrega
    }

    if (!user && !isPublicPath) {
      // Se não há usuário e a rota não é pública, redireciona para o login
      router.push('/login');
    } else if (user && isPublicPath) {
      // Se há um usuário e ele tenta acessar o login/register, redireciona para a home
      router.push('/');
    }
  }, [user, isLoading, isPublicPath, router, pathname]);
  
  if (isLoading) {
     return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  // Se o usuário não estiver logado e a rota não for pública, o useEffect já terá redirecionado.
  // Renderiza um loader ou null para evitar piscar de conteúdo.
  if (!user && !isPublicPath) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }
  
  // Permite o acesso a rotas públicas
  if (isPublicPath) {
    return <>{children}</>;
  }
  
  // Se o usuário estiver logado, mostra o conteúdo protegido
  if(user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-16 w-16 text-primary animate-spin" />
    </div>
  )
}
