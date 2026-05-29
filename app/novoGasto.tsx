import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useGastosStore } from '@/src/store/gastos.store';
import { useAuthStore } from '@/src/store/auth.store';

export default function NovoGastoScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const adicionarGasto = useGastosStore((state) => state.adicionarGasto);
  const user = useAuthStore((state) => state.user);

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [cameraAberta, setCameraAberta] = useState(false);

  const tirarFoto = async () => {
    if (!cameraRef.current) return;

    try {
      const foto = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });

      if (foto?.uri) {
        setFotoUri(foto.uri);
        setCameraAberta(false);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  const salvarGasto = async () => {
    const valorConvertido = Number(valor.replace(',', '.'));

    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Informe a descrição do gasto.');
      return;
    }

    if (!valor.trim() || Number.isNaN(valorConvertido) || valorConvertido <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Sua sessão expirou. Entre novamente.');
      return;
    }

    try {
      await adicionarGasto(user.id, {
        descricao: descricao.trim(),
        valor: valorConvertido,
        categoria: 'outros',
        imagemUri: fotoUri || undefined,
      });

      Alert.alert('Sucesso', 'Gasto salvo com sucesso!');
      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o gasto. Tente novamente.');
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Carregando permissões...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.permissionText}>
          Precisamos da sua permissão para usar a câmera.
        </Text>

        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Permitir câmera</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (cameraAberta) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />

        <View style={styles.cameraActions}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => setCameraAberta(false)}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </Pressable>

          <Pressable style={styles.primaryButton} onPress={tirarFoto}>
            <Text style={styles.primaryButtonText}>Capturar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Novo Gasto</Text>

        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />

        <TextInput
          style={styles.input}
          placeholder="Valor"
          value={valor}
          onChangeText={setValor}
          keyboardType="numeric"
        />

        <Pressable
          style={styles.primaryButton}
          onPress={() => setCameraAberta(true)}
        >
          <Text style={styles.primaryButtonText}>Abrir câmera</Text>
        </Pressable>

        {fotoUri ? <Image source={{ uri: fotoUri }} style={styles.preview} /> : null}

        <Pressable style={styles.saveButton} onPress={salvarGasto}>
          <Text style={styles.saveButtonText}>Salvar gasto</Text>
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
    padding: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F7F9FC',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#111827',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginTop: 8,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#111827',
  },
});