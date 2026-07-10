import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius, typography } from '@/constants/theme';
import { ChatMessage } from '@/types';
import ChatBubble from '@/components/ChatBubble';
import { sendChatMessage } from '@/services/aiService';
import { useAuth } from '@/context/AuthContext';
import { saveChatMessage, getChatHistory } from '@/services/watchlistService';

export default function AIChatScreen() {
  const { session } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your AI trading assistant. Ask me about crypto, stocks, market trends, or trading concepts.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (session?.user) {
      getChatHistory(session.user.id)
        .then((history) => {
          if (history?.length) {
            setMessages((prev) => [
              ...prev,
              ...history.map((h: any) => ({
                id: h.id,
                role: h.role,
                content: h.content,
                createdAt: h.created_at,
              })),
            ]);
          }
        })
        .catch(() => {});
    }
  }, [session]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    if (session?.user) saveChatMessage(session.user.id, 'user', userMessage.content);

    try {
      const reply = await sendChatMessage(messages, userMessage.content);
      const aiMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      if (session?.user) saveChatMessage(session.user.id, 'assistant', reply);
    } catch (e) {
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "Sorry, I couldn't reach the AI service. Please check your connection and try again.",
        createdAt: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />
      {loading && <ActivityIndicator color={colors.primary} style={{ marginBottom: spacing.sm }} />}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask about a coin, stock, or strategy..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingVertical: spacing.md },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', padding: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm,
  },
  input: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, color: colors.text, maxHeight: 120,
  },
  sendButton: {
    backgroundColor: colors.primary, width: 44, height: 44, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  sendButtonText: { fontSize: 18, color: '#0B0E14' },
});
