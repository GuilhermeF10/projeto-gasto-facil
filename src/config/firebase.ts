import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  // @ts-ignore - exportado apenas no build React Native do firebase/auth
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDo74skBgJpgRafx1XMnDxt1YhalbSOjU4',
  authDomain: 'meus-gastos-f26f2.firebaseapp.com',
  projectId: 'meus-gastos-f26f2',
  storageBucket: 'meus-gastos-f26f2.firebasestorage.app',
  messagingSenderId: '331296445168',
  appId: '1:331296445168:web:f22cd0aad658a738076835',
};

const app = initializeApp(firebaseConfig);

// Na web o getAuth já persiste a sessão; no nativo usamos AsyncStorage.
export const auth: Auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export const db = getFirestore(app);

export default app;
