import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/src/store/auth.store';
import { useGastosStore } from '@/src/store/gastos.store';

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const user = useAuthStore((state) => state.user);
  const initializing = useAuthStore((state) => state.initializing);

  // Redireciona conforme a sessão do Firebase.
  useEffect(() => {
    if (initializing) return;

    const rota = segments[0] as string | undefined;
    const emAuth = rota === 'login' || rota === 'cadastro' || rota === 'esqueciSenha';

    if (!user && !emAuth) {
      router.replace('/login');
    } else if (user && (emAuth || !rota)) {
      router.replace('/(tabs)');
    }
  }, [user, initializing, segments, router]);

  // Assina os gastos do usuário no Firestore enquanto estiver logado.
  useEffect(() => {
    if (!user) {
      useGastosStore.getState().limpar();
      return;
    }
    const unsubscribe = useGastosStore.getState().assinarGastos(user.id);
    return unsubscribe;
  }, [user]);

  if (initializing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="esqueciSenha" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="novoGasto" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Modal',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F9FC',
  },
});
