import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  type Auth,
  type UserCredential
} from "firebase/auth";

// As funções agora recebem a instância 'auth' como parâmetro.

export const signUp = (auth: Auth, email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (auth: Auth, email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = (auth: Auth): Promise<void> => {
  return signOut(auth);
};
