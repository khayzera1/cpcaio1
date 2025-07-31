'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { onAuthChange, signIn as signInService, logOut as signOutService, signUp as signUpService } from '@/services/auth-service';

// Este hook agora é a única fonte de verdade para o estado de autenticação.
// Ele só é executado no lado do cliente.
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // onAuthChange se inscreve no estado de autenticação do Firebase.
    // O callback só é chamado no cliente, evitando problemas de SSR.
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Retorna a função de limpeza para se desinscrever quando o componente desmontar.
    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    await signOutService();
    // Após o logout, redireciona para a página de login.
    router.push('/login');
  };

  return {
    user,
    isLoading,
    signInUser: signInService,
    signUpUser: signUpService,
    signOutUser,
  };
};
