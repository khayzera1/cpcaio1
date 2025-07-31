
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  type Auth
} from "firebase/auth";

// Wrappers para as funções de autenticação do Firebase
// Elas agora recebem a instância 'auth' como parâmetro

export const signUp = (auth: Auth, email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (auth: Auth, email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = (auth: Auth) => {
  return signOut(auth);
};
