import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useGastosStore } from '@/src/store/gastos.store';

const screenWidth = Dimensions.get('window').width;

type Gasto = {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  imagemUri?: string;
};

const mesesLabel = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function parseGastoDate(data: string): Date {
  if (!data) return new Date();

  if (data.includes('T')) {
    return new Date(data);
  }

  if (data.includes('/')) {
    const [dia, mes, ano] = data.split('/');
    return new Date(Number(ano), Number(mes) - 1, Number(dia));
  }

  return new Date(data);
}

export default function RelatoriosScreen() {
  const gastos = useGastosStore((state) => state.gastos);

  const {
    totalGeral,
    totalMesAtual,
    quantidadeGastos,
    chartLabels,
    chartValues,
  } = useMemo(() => {
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    const totaisPorMes = new Array(12).fill(0);

    let somaGeral = 0;
    let somaMesAtual = 0;

    gastos.forEach((gasto: Gasto) => {
      const data = parseGastoDate(gasto.data);

      if (Number.isNaN(data.getTime())) return;

      const mes = data.getMonth();
      const ano = data.getFullYear();

      somaGeral += gasto.valor;

      if (ano === anoAtual) {
        totaisPorMes[mes] += gasto.valor;
      }

      if (ano === anoAtual && mes === mesAtual) {
        somaMesAtual += gasto.valor;
      }
    });

    const mesesComDados = totaisPorMes
      .map((valor, index) => ({
        label: mesesLabel[index],
        valor,
      }))
      .filter((item) => item.valor > 0);

    return {
      totalGeral: somaGeral,
      totalMesAtual: somaMesAtual,
      quantidadeGastos: gastos.length,
      chartLabels: mesesComDados.length ? mesesComDados.map((item) => item.label) : ['Sem dados'],
      chartValues: mesesComDados.length ? mesesComDados.map((item) => item.valor) : [0],
    };
  }, [gastos]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Relatórios</Text>
        <Text style={styles.subtitle}>Acompanhe a evolução dos seus gastos por mês</Text>

        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total geral</Text>
            <Text style={styles.cardValue}>R$ {totalGeral.toFixed(2)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Este mês</Text>
            <Text style={styles.cardValue}>R$ {totalMesAtual.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.cardFull}>
          <Text style={styles.cardLabel}>Quantidade de gastos</Text>
          <Text style={styles.cardValue}>{quantidadeGastos}</Text>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Oscilação mensal</Text>
          <Text style={styles.chartSubtitle}>Linha com o total gasto em cada mês do ano atual</Text>

          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels: chartLabels,
                datasets: [{ data: chartValues }],
              }}
              width={screenWidth - 72}
              height={220}
              yAxisLabel="R$ "
              yAxisSuffix=""
              fromZero
              bezier
              withInnerLines
              withOuterLines={false}
              withVerticalLines={false}
              chartConfig={{
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#2563EB',
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: '#E5E7EB',
                },
              }}
              style={styles.chart}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
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
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardFull: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 18,
  },
  cardLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 14,
  },
  chartWrapper: {
    alignItems: 'center',
    paddingRight: 6,
  },
  chart: {
    borderRadius: 12,
    marginLeft: -8,
  },
});