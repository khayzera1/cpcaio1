
'use client';

import React, { 
    createContext, 
    useState, 
    useEffect, 
    ReactNode, 
    useCallback,
    useMemo
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import * as AuthService from '@/services/auth-service';
import * as ClientService from '@/services/client-service';
import type { Client } from '@/lib/types';
import type { NewClientFormData } from '@/app/clients/new/page';
import { auth, db } from '@/lib/firebase-config'; // Import directly

interface AuthContextType {
  user: User | null;
  clients: Client[] | null;
  isLoading: boolean;
  isClientsLoading: boolean;
  signInUser: typeof AuthService.signIn;
  signUpUser: typeof AuthService.signUp;
  signOutUser: () => Promise<void>;
  addClient: (clientData: NewClientFormData) => Promise<string>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/login', '/register'];

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientsLoading, setIsClientsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchClients = useCallback(async () => {
    if (user) {
      setIsClientsLoading(true);
      try {
        const fetchedClients = await ClientService.getClients(db);
        setClients(fetchedClients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        setClients([]);
      } finally {
        setIsClientsLoading(false);
      }
    } else {
      setClients(null);
      setIsClientsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);
  
  useEffect(() => {
    if (isLoading) return;

    const isPublic = publicRoutes.includes(pathname);

    if (!user && !isPublic) {
      router.push('/login');
    } else if (user && isPublic) {
      router.push('/');
    }
  }, [user, isLoading, pathname, router]);

  const signOutUser = useCallback(async () => {
    await AuthService.logOut(auth);
    router.push('/login');
  }, [router]);

  const addClient = useCallback(async (clientData: NewClientFormData) => {
    const newClientId = await ClientService.addClient(db, clientData);
    await fetchClients();
    return newClientId;
  }, [fetchClients]);
  
  const signInUser = useCallback((email:string, password:string) => {
    return AuthService.signIn(auth, email, password);
  }, []);

  const signUpUser = useCallback((email:string, password:string) => {
    return AuthService.signUp(auth, email, password);
  }, []);

  const value = useMemo(() => ({
    user,
    clients,
    isLoading,
    isClientsLoading,
    signInUser,
    signUpUser,
    signOutUser,
    addClient,
  }), [user, clients, isLoading, isClientsLoading, signInUser, signUpUser, signOutUser, addClient]);

  const isAuthRoute = publicRoutes.includes(pathname);
  if (isLoading || (!user && !isAuthRoute) || (user && isAuthRoute)) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="h-16 w-16 text-primary animate-spin" />
       </div>
     );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
