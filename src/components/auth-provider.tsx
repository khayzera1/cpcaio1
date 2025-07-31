'use client';

import React, { 
    createContext, 
    useState, 
    useEffect, 
    ReactNode, 
    useCallback,
    useMemo
} from 'react';
import { User, onAuthStateChanged, getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from "firebase/firestore";
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import * as AuthService from '@/services/auth-service';
import * as ClientService from '@/services/client-service';
import type { Client } from '@/lib/types';
import type { NewClientFormData } from '@/app/clients/new/page';

// Interface do Contexto
interface AuthContextType {
  user: User | null;
  clients: Client[] | null;
  isLoading: boolean;
  isClientsLoading: boolean;
  signInUser: (email: string, password: string) => Promise<any>;
  signUpUser: (email: string, password: string) => Promise<any>;
  signOutUser: () => Promise<void>;
  addClient: (clientData: NewClientFormData) => Promise<string>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rotas públicas que não exigem autenticação
const publicRoutes = ['/login', '/register'];

// Componente Provedor
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientsLoading, setIsClientsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Inicialização do Firebase centralizada e memoizada.
  // Isso garante que o Firebase só seja inicializado uma vez e no cliente.
  const { app, auth, db } = useMemo(() => {
    const apps = getApps();
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    const app: FirebaseApp = apps.length ? getApp() : initializeApp(firebaseConfig);
    const auth: Auth = getAuth(app);
    const db: Firestore = getFirestore(app);
    return { app, auth, db };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

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
  }, [user, db]);

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
    setClients(null);
    router.push('/login');
  }, [auth, router]);

  const addClient = useCallback(async (clientData: NewClientFormData) => {
    const newClientId = await ClientService.addClient(db, clientData);
    await fetchClients(); // Re-fetch clients after adding a new one
    return newClientId;
  }, [db, fetchClients]);
  
  const signInUser = useCallback((email:string, password:string) => {
    return AuthService.signIn(auth, email, password);
  }, [auth]);

  const signUpUser = useCallback((email:string, password:string) => {
    return AuthService.signUp(auth, email, password);
  }, [auth]);

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

  const isPublic = publicRoutes.includes(pathname);
  if (isLoading || (!user && !isPublic)) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="h-16 w-16 text-primary animate-spin" />
       </div>
     );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
