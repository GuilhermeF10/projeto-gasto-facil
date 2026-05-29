import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from '@/src/config/firebase';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResult = {
  success: boolean;
  error?: string;
};

type AuthState = {
  user: AuthUser | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const mapUser = (user: User | null): AuthUser | null =>
  user
    ? {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Usuário',
        email: user.email || '',
      }
    : null;

// Traduz os códigos de erro do Firebase para mensagens em português.
const traduzErro = (code?: string): string => {
  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/network-request-failed':
      return 'Falha de conexão. Verifique sua internet.';
    default:
      return 'Não foi possível concluir. Tente novamente.';
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,

  login: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: traduzErro(error?.code) };
    }
  },

  register: async (name, email, password) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      await updateProfile(credential.user, { displayName: name.trim() });
      // Atualiza o estado local com o nome recém-definido.
      set({ user: mapUser(credential.user) });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: traduzErro(error?.code) };
    }
  },

  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (error: any) {
      // Não revelamos se o e-mail existe; tratamos "user-not-found" como sucesso silencioso.
      if (error?.code === 'auth/user-not-found') {
        return { success: true };
      }
      return { success: false, error: traduzErro(error?.code) };
    }
  },

  logout: async () => {
    await signOut(auth);
  },
}));

// Mantém o store sincronizado com a sessão do Firebase.
onAuthStateChanged(auth, (firebaseUser) => {
  useAuthStore.setState({
    user: mapUser(firebaseUser),
    initializing: false,
  });
});
