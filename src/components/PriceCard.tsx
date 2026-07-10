import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, radius, typography } from '@/constants/theme';
import { Asset } from '@/types';

interface Props {
  asset: Asset;
  onPress?: () => void;
}

export default function PriceCard({ asset, onPress }: Props) {
  const isUp = asset.changePercent24h >= 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        {asset.imageUrl ? (
          <Image source={{ uri: asset.imageUrl }} style={styles.icon} />
        ) : (
          <View style={[styles.icon, styles.iconFallback]}>
            <Text style={styles.iconFallbackText}>{asset.symbol.slice(0, 2)}</Text>
          </View>
        )}
        <View>
          <Text style={styles.symbol}>{asset.symbol}</Text>
          <Text style={styles.name} numberOfLines={1}>{asset.name}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.price}>${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
        <Text style={[styles.change, { color: isUp ? colors.chartGreen : colors.chartRed }]}>
          {isUp ? '▲' : '▼'} {Math.abs(asset.changePercent24h).toFixed(2)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.sm },
  icon: { width: 36, height: 36, borderRadius: radius.full, marginRight: spacing.sm },
  iconFallback: { backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  iconFallbackText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  symbol: { ...typography.h3, color: colors.text },
  name: { ...typography.small, color: colors.textMuted, maxWidth: 140 },
  right: { alignItems: 'flex-end' },
  price: { ...typography.h3, color: colors.text },
  change: { ...typography.small, marginTop: 2 },
});
