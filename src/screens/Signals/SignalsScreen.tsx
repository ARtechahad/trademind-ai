import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { fetchCryptoAssets, fetchStockAssets } from '@/services/marketService';
import { generateSignal } from '@/services/aiService';
import { AISignal } from '@/types';
import SignalCard from '@/components/SignalCard';

export default function SignalsScreen() {
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSignals() {
      try {
        const [crypto, stocks] = await Promise.all([
          fetchCryptoAssets().catch(() => []),
          fetchStockAssets().catch(() => []),
        ]);
        const topAssets = [...crypto.slice(0, 3), ...stocks.slice(0, 2)];

        const results = await Promise.all(
          topAssets.map((asset) =>
            generateSignal(asset.symbol, asset.type, {
              price: asset.price,
              changePercent24h: asset.changePercent24h,
            }).catch(() => null)
          )
        );

        setSignals(results.filter((s): s is AISignal => s !== null));
      } finally {
        setLoading(false);
      }
    }
    loadSignals();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Trading Signals</Text>
      <Text style={styles.subtitle}>Generated for your top assets. Informational only, not financial advice.</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={signals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SignalCard signal={item} />}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          ListEmptyComponent={<Text style={styles.muted}>No signals available right now.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.small, color: colors.textMuted, marginBottom: spacing.lg },
  muted: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
