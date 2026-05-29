import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/auth.store';

export default function PerfilScreen() {
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Meu Perfil</Text>
        <Text style={styles.subtitle}>Veja seus dados de acesso</Text>

        <View style={styles.card}>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.info}>{user?.name || 'Não informado'}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.info}>{user?.email || 'Não informado'}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>ID</Text>
            <Text style={styles.info}>{String(user?.id || 'Não informado')}</Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sair da Conta</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 6,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  infoBlock: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  info: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#EF4444',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});