import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '@/constants/theme';
import { AISignal } from '@/types';

const actionColors: Record<AISignal['action'], string> = {
  BUY: colors.chartGreen,
  SELL: colors.chartRed,
  HOLD: colors.warning,
};

export default function SignalCard({ signal }: { signal: AISignal }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{signal.symbol}</Text>
        <View style={[styles.badge, { backgroundColor: actionColors[signal.action] }]}>
          <Text style={styles.badgeText}>{signal.action}</Text>
        </View>
      </View>
      <Text style={styles.confidence}>Confidence: {signal.confidence}</Text>
      <Text style={styles.reasoning}>{signal.reasoning}</Text>
      <Text style={styles.disclaimer}>Not financial advice - informational only.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  symbol: { ...typography.h3, color: colors.text },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.sm },
  badgeText: { ...typography.caption, color: '#0B0E14', fontWeight: '700' },
  confidence: { ...typography.small, color: colors.textMuted, marginTop: spacing.xs },
  reasoning: { ...typography.body, color: colors.text, marginTop: spacing.xs },
  disclaimer: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm, fontStyle: 'italic' },
});
