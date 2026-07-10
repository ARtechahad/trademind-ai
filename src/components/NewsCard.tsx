import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { colors, spacing, radius, typography } from '@/constants/theme';
import { NewsItem } from '@/types';

const sentimentColors = {
  positive: colors.chartGreen,
  negative: colors.chartRed,
  neutral: colors.textMuted,
};

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.url)} activeOpacity={0.7}>
      <View style={styles.headerRow}>
        <Text style={styles.source}>{item.source}</Text>
        <View style={[styles.dot, { backgroundColor: sentimentColors[item.sentiment] }]} />
        <Text style={[styles.sentiment, { color: sentimentColors[item.sentiment] }]}>
          {item.sentiment}
        </Text>
      </View>
      <Text style={styles.headline} numberOfLines={2}>{item.headline}</Text>
      <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  source: { ...typography.caption, color: colors.textMuted },
  dot: { width: 6, height: 6, borderRadius: 3, marginLeft: spacing.sm, marginRight: 4 },
  sentiment: { ...typography.caption, textTransform: 'capitalize' },
  headline: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  summary: { ...typography.small, color: colors.textMuted },
});
