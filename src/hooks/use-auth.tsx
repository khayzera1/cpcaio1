'use client';

import { 
    useState, 
    useEffect, 
    createContext, 
    useContext, 
    ReactNode,
    useCallback,
    useMemo,
} from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, User, onAuthStateChanged } from "firebase/auth";
import * as AuthService from '@/services/auth-service';
import * as ClientService from '@/services/client-service';
import { NewClientFormData } from '@/app/clients/new/page';
import type { Client } from '@/lib/types';


interface AuthContextType {
  user: User | null | undefined; // undefined while loading, null if not logged in
  isLoading: boolean;
  isClientsLoading: boolean;
  clients: Client[] | null;
  signInUser?: typeof AuthService.signIn;
  signUpUser?: typeof AuthService.signUp;
  signOutUser?: () => Promise<void>;
  addClient?: (clientData: NewClientFormData) => Promise<string>;
}

const AuthContext = createContext<AuthContextType>({
    user: undefined,
    isLoading: true,
    isClientsLoading: true,
    clients: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProviderContent = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(); // undefined on initial load
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[] | null>(null);
  const [isClientsLoading, setIsClientsLoading] = useState(true);
  
  const { auth, db } = useMemo(() => {
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { auth, db };
  }, []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user) {
      setIsClientsLoading(true);
      ClientService.getClients(db)
        .then(setClients)
        .catch(error => {
            console.error("Error fetching clients:", error);
            setClients(null);
        })
        .finally(() => setIsClientsLoading(false));
    } else {
        setClients(null); 
    }
  }, [user, db]);
  
  const signOutUser = useCallback(async () => {
    try {
      await AuthService.logOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [auth]);

  const addClient = useCallback((clientData: NewClientFormData) => {
    return ClientService.addClient(db, clientData);
  }, [db]);

  const signInUser = useCallback((email, password) => {
      return AuthService.signIn(auth, email, password);
  }, [auth]);

  const signUpUser = useCallback((email, password) => {
      return AuthService.signUp(auth, email, password);
  }, [auth]);

  const value: AuthContextType = useMemo(() => ({
    user,
    isLoading,
    clients,
    isClientsLoading,
    signInUser,
    signUpUser,
    signOutUser,
    addClient,
  }), [user, isLoading, clients, isClientsLoading, signInUser, signUpUser, signOutUser, addClient]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
