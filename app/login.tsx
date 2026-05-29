import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/auth.store';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    setApiError(null);
    setLoading(true);

    try {
      const response = await login(values.email, values.password);

      if (response?.success) {
        router.replace('/(tabs)');
      } else {
        setApiError(response?.error ?? 'E-mail ou senha incorretos.');
      }
    } catch {
      setApiError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Gasto Fácil</Text>
          <Text style={styles.subtitle}>Entre para gerenciar seus gastos</Text>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    touched.email && errors.email ? styles.inputError : null,
                  ]}
                  placeholder="E-mail"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {touched.email && errors.email ? (
                  <Text style={styles.error}>{errors.email}</Text>
                ) : null}

                <TextInput
                  style={[
                    styles.input,
                    touched.password && errors.password ? styles.inputError : null,
                  ]}
                  placeholder="Senha"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                {touched.password && errors.password ? (
                  <Text style={styles.error}>{errors.password}</Text>
                ) : null}

                {apiError ? <Text style={styles.error}>{apiError}</Text> : null}

                <Pressable
                  style={styles.forgotButton}
                  onPress={() => router.push('/esqueciSenha')}
                >
                  <Text style={styles.forgotText}>Esqueci minha senha</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.button,
                    (loading || !values.email || !values.password) && styles.buttonDisabled,
                  ]}
                  onPress={() => handleSubmit()}
                  disabled={loading || !values.email || !values.password}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Entrar</Text>
                  )}
                </Pressable>

                <Pressable
                  style={styles.linkButton}
                  onPress={() => router.push('/cadastro')}
                >
                  <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
                </Pressable>
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 30,
    color: '#111827',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F9FAFB',
    color: '#111827',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  error: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: -4,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 10,
  },
  forgotText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});