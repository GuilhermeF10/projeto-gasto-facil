import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGastosStore, Gasto } from '@/src/store/gastos.store';

export default function MeusGastosScreen() {
  const gastos = useGastosStore((state) => state.gastos);
  const removerGasto = useGastosStore((state) => state.removerGasto);

  const total = gastos.reduce((acc, item) => acc + item.valor, 0);

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

  const renderItem = ({ item }: { item: Gasto }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.gastoDescricao}>{item.descricao}</Text>
        <Text style={styles.gastoValor}>R$ {item.valor.toFixed(2)}</Text>
      </View>

      <Text style={styles.gastoData}>{item.data}</Text>

      {item.imagemUri ? (
        <Image source={{ uri: item.imagemUri }} style={styles.gastoImagem} />
      ) : null}

      <Pressable
        style={styles.removeButton}
        onPress={() => confirmarRemocao(item.id)}
      >
        <Text style={styles.removeButtonText}>Remover</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Meus Gastos</Text>
        <Text style={styles.subtitle}>Acompanhe e gerencie seus lançamentos</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total registrado</Text>
          <Text style={styles.summaryValue}>R$ {total.toFixed(2)}</Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/novoGasto')}
        >
          <Text style={styles.addButtonText}>Adicionar Gasto</Text>
        </Pressable>

        <FlatList
          data={gastos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum gasto cadastrado.</Text>
          }
          renderItem={renderItem}
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
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16A34A',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 18,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  gastoDescricao: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  gastoValor: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16A34A',
  },
  gastoData: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
  },
  gastoImagem: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 12,
  },
  removeButton: {
    marginTop: 12,
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6B7280',
    fontSize: 15,
  },
});