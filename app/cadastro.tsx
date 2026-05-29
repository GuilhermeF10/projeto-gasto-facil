import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/auth.store';

const validationSchema = Yup.object({
  name: Yup.string().required('Nome completo é obrigatório'),
  email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  password: Yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
});

const CadastroScreen = () => {
  const router = useRouter();
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleCadastro = async (values: { name: string; email: string; password: string }) => {
    setApiError(null);
    setLoading(true);

    try {
      const response = await register(values.name, values.email, values.password);

      if (response.success) {
        router.replace('/(tabs)');
      } else {
        setApiError(response.error ?? 'Falha no cadastro. Tente novamente.');
      }
    } catch (error) {
      setApiError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua conta</Text>

      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleCadastro}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          submitForm,
        }) => (
          <>
            <TextInput
              style={[styles.input, touched.name && errors.name ? styles.inputError : null]}
              placeholder="Nome completo"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
              style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
              placeholder="E-mail"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
              placeholder="Senha"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            {apiError && <Text style={styles.error}>{apiError}</Text>}

            <Pressable
              style={[
                styles.button,
                (!values.name || !values.email || !values.password || !!errors.name || !!errors.email || !!errors.password) && styles.buttonDisabled,
              ]}
              onPress={submitForm}
              disabled={!values.name || !values.email || !values.password || !!errors.name || !!errors.email || !!errors.password}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.linkButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.linkText}>Já tem conta? Faça login</Text>
            </Pressable>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 32,
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F1F8E9',
    color: '#000',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  inputError: {
    borderColor: '#D94C4C',
  },
  error: {
    color: '#D94C4C',
    fontSize: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default CadastroScreen;