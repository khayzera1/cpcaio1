'use client';

import { 
    useState, 
    useEffect, 
    createContext, 
    useContext, 
    ReactNode,
    useCallback,
    useMemo
} from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, User, onAuthStateChanged } from "firebase/auth";
import * as AuthService from '@/services/auth-service';
import * as ClientService from '@/services/client-service';
import { NewClientFormData } from '@/components/clients/new-client-page';


// 1. Defina a Interface do Contexto
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInUser: typeof AuthService.signIn;
  signUpUser: typeof AuthService.signUp;
  signOutUser: () => Promise<void>;
  addClient: (clientData: NewClientFormData) => Promise<string>;
  getClients: () => Promise<any[]>;
}

// 2. Crie o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Crie o Provedor do Contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { app, auth, db } = useMemo(() => {
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
    return { app, auth, db };
  }, []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);
  
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

  const getClients = useCallback(() => {
    return ClientService.getClients(db);
  }, [db]);


  const value = {
    user,
    isLoading,
    signInUser: (email, password) => AuthService.signIn(auth, email, password),
    signUpUser: (email, password) => AuthService.signUp(auth, email, password),
    signOutUser,
    addClient,
    getClients,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Crie o Hook Customizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
