import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { colors, spacing, typography, radius } from '@/constants/theme';
import { fetchCryptoAssets, fetchStockAssets } from '@/services/marketService';
import { Asset, AssetType } from '@/types';
import PriceCard from '@/components/PriceCard';

export default function MarketsScreen({ navigation }: any) {
  const [filter, setFilter] = useState<AssetType>('crypto');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (type: AssetType) => {
    try {
      const data = type === 'crypto' ? await fetchCryptoAssets() : await fetchStockAssets();
      setAssets(data);
    } catch (e) {
      console.warn('Failed to load assets', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    load(filter);
  }, [filter, load]);

  const onRefresh = () => {
    setRefreshing(true);
    load(filter);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, filter === 'crypto' && styles.tabActive]}
          onPress={() => setFilter('crypto')}
        >
          <Text style={[styles.tabText, filter === 'crypto' && styles.tabTextActive]}>Crypto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filter === 'stock' && styles.tabActive]}
          onPress={() => setFilter('stock')}
        >
          <Text style={[styles.tabText, filter === 'stock' && styles.tabTextActive]}>Stocks</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.muted}>Loading {filter} data...</Text>
      ) : (
        <FlatList
          data={assets}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <PriceCard
              asset={item}
              onPress={() => navigation.navigate('AssetDetail', { asset: item })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  tabRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, padding: 4, marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.sm },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.body, color: colors.textMuted },
  tabTextActive: { color: '#0B0E14', fontWeight: '700' },
  list: { paddingBottom: spacing.xl },
  muted: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
