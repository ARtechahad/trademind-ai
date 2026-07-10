import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { colors, spacing, typography, radius } from '@/constants/theme';
import { fetchAllAssets } from '@/services/marketService';
import { Asset } from '@/types';
import PriceCard from '@/components/PriceCard';
import { useAuth } from '@/context/AuthContext';

export default function DashboardScreen({ navigation }: any) {
  const { session } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchAllAssets();
      setAssets(data);
    } catch (e) {
      console.warn('Failed to load assets', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const gainers = [...assets].sort((a, b) => b.changePercent24h - a.changePercent24h).slice(0, 3);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <Text style={styles.greeting}>Welcome back</Text>
      <Text style={styles.email}>{session?.user?.email}</Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Tracked Assets</Text>
          <Text style={styles.summaryValue}>{assets.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Top Movers</Text>
          <Text style={styles.summaryValue}>{gainers.length}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Top Gainers (24h)</Text>
      {loading && <Text style={styles.muted}>Loading market data...</Text>}
      {gainers.map((asset) => (
        <PriceCard
          key={`${asset.type}-${asset.id}`}
          asset={asset}
          onPress={() => navigation.navigate('Markets')}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  greeting: { ...typography.h1, color: colors.text },
  email: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
  summaryRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  summaryCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md },
  summaryLabel: { ...typography.small, color: colors.textMuted },
  summaryValue: { ...typography.h2, color: colors.primary, marginTop: spacing.xs },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  muted: { color: colors.textMuted },
});
