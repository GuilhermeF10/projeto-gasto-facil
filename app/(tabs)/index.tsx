import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGastosStore, Gasto } from '@/src/store/gastos.store';

export default function HomeScreen() {
  const gastos = useGastosStore((state) => state.gastos);
  const removerGasto = useGastosStore((state) => state.removerGasto);

  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.valor, 0);

  const confirmarRemocao = (id: string) => {
    Alert.alert('Remover gasto', 'Deseja realmente excluir este gasto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => removerGasto(id),
      },
    ]);
  };

  const renderGasto = ({ item }: { item: Gasto }) => (
    <View style={styles.gastoItem}>
      <View style={styles.gastoHeader}>
        <Text style={styles.gastoDescricao}>{item.descricao}</Text>
        <Text style={styles.gastoValor}>R$ {item.valor.toFixed(2)}</Text>
      </View>

      <Text style={styles.gastoData}>{item.data}</Text>

      {item.imagemUri ? (
        <Image source={{ uri: item.imagemUri }} style={styles.gastoImagem} />
      ) : null}

      <Pressable
        style={styles.deleteButton}
        onPress={() => confirmarRemocao(item.id)}
      >
        <Text style={styles.deleteButtonText}>Remover</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Meus gastos</Text>
        <Text style={styles.total}>Total gasto: R$ {totalGastos.toFixed(2)}</Text>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/novoGasto')}
        >
          <Text style={styles.addButtonText}>+ Adicionar gasto</Text>
        </Pressable>

        <FlatList
          data={gastos}
          keyExtractor={(item) => item.id}
          renderItem={renderGasto}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum gasto cadastrado ainda.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  total: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 18,
  },
  addButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 18,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  gastoItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  gastoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gastoDescricao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    marginRight: 10,
  },
  gastoValor: {
    fontSize: 16,
    color: '#16A34A',
    fontWeight: 'bold',
  },
  gastoData: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
  gastoImagem: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 12,
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 30,
    fontSize: 15,
  },
});