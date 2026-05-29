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
});

export default function EsqueciSenhaScreen() {
  const router = useRouter();
  const { resetPassword } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const handleReset = async (values: { email: string }) => {
    setApiError(null);
    setLoading(true);

    try {
      const response = await resetPassword(values.email);

      if (response.success) {
        setEnviado(true);
      } else {
        setApiError(response.error ?? 'Não foi possível enviar. Tente novamente.');
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
          <Text style={styles.title}>Recuperar senha</Text>
          <Text style={styles.subtitle}>
            Informe o e-mail da sua conta e enviaremos um link para você criar uma
            nova senha.
          </Text>

          {enviado ? (
            <>
              <Text style={styles.success}>
                Se houver uma conta com esse e-mail, enviamos um link para redefinir
                sua senha. Verifique também a caixa de spam.
              </Text>

              <Pressable
                style={styles.button}
                onPress={() => router.replace('/login')}
              >
                <Text style={styles.buttonText}>Voltar para o login</Text>
              </Pressable>
            </>
          ) : (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={validationSchema}
              onSubmit={handleReset}
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

                  {apiError ? <Text style={styles.error}>{apiError}</Text> : null}

                  <Pressable
                    style={[
                      styles.button,
                      (loading || !values.email) && styles.buttonDisabled,
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={loading || !values.email}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.buttonText}>Enviar link</Text>
                    )}
                  </Pressable>

                  <Pressable
                    style={styles.linkButton}
                    onPress={() => router.replace('/login')}
                  >
                    <Text style={styles.linkText}>Voltar para o login</Text>
                  </Pressable>
                </>
              )}
            </Formik>
          )}
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
    fontSize: 26,
    color: '#111827',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
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
  success: {
    color: '#16A34A',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
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
