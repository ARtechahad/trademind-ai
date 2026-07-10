import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '@/constants/theme';
import { ChatMessage } from '@/types';

export default function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.row, { justifyContent: isUser ? 'flex-end' : 'flex-start' }]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.text, { color: isUser ? '#0B0E14' : colors.text }]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: spacing.sm, paddingHorizontal: spacing.md },
  bubble: { maxWidth: '80%', borderRadius: radius.lg, padding: spacing.md },
  userBubble: { backgroundColor: colors.primary, borderBottomRightRadius: radius.sm },
  aiBubble: { backgroundColor: colors.surface, borderBottomLeftRadius: radius.sm },
  text: { ...typography.body },
});
