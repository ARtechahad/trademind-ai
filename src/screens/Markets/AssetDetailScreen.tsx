import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, spacing, typography, radius } from '@/constants/theme';
import { generateSignal } from '@/services/aiService';
import { AISignal } from '@/types';
import SignalCard from '@/components/SignalCard';

const screenWidth = Dimensions.get('window').width;

export default function AssetDetailScreen({ route }: any) {
  const { asset } = route.params;
  const [signal, setSignal] = useState<AISignal | null>(null);
  const [loadingSignal, setLoadingSignal] = useState(false);

  const handleGetSignal = async () => {
    setLoadingSignal(true);
    try {
      const result = await generateSignal(asset.symbol, asset.type, {
        price: asset.price,
        changePercent24h: asset.changePercent24h,
      });
      setSignal(result);
    } catch (e) {
      console.warn('Failed to generate signal', e);
    } finally {
      setLoadingSignal(false);
    }
  };

  const isUp = asset.changePercent24h >= 0;
  const sparkline = asset.sparkline?.filter((_: number, i: number) => i % 4 === 0) ?? [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.symbol}>{asset.symbol}</Text>
      <Text style={styles.name}>{asset.name}</Text>
      <Text style={styles.price}>${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
      <Text style={[styles.change, { color: isUp ? colors.chartGreen : colors.chartRed }]}>
        {isUp ? '▲' : '▼'} {Math.abs(asset.changePercent24h).toFixed(2)}% (24h)
      </Text>

      {sparkline.length > 1 && (
        <LineChart
          data={{ labels: [], datasets: [{ data: sparkline }] }}
          width={screenWidth - spacing.lg * 2}
          height={180}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withHorizontalLabels={false}
          withVerticalLabels={false}
          chartConfig={{
            backgroundColor: colors.surface,
            backgroundGradientFrom: colors.surface,
            backgroundGradientTo: colors.surface,
            color: () => (isUp ? colors.chartGreen : colors.chartRed),
            strokeWidth: 2,
          }}
          bezier
          style={styles.chart}
        />
      )}

      <TouchableOpacity style={styles.aiButton} onPress={handleGetSignal} disabled={loadingSignal}>
        <Text style={styles.aiButtonText}>
          {loadingSignal ? 'Analyzing...' : '✨ Get AI Signal'}
        </Text>
      </TouchableOpacity>

      {signal && <SignalCard signal={signal} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  symbol: { ...typography.h1, color: colors.text },
  name: { ...typography.body, color: colors.textMuted, marginBottom: spacing.md },
  price: { ...typography.h1, color: colors.text },
  change: { ...typography.body, marginBottom: spacing.md },
  chart: { borderRadius: radius.md, marginBottom: spacing.lg },
  aiButton: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginBottom: spacing.lg },
  aiButtonText: { ...typography.h3, color: '#0B0E14' },
});
