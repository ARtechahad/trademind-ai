import axios from 'axios';
import { AI_PROXY_URL } from '@env';
import { AISignal, ChatMessage, NewsItem } from '@/types';

/**
 * IMPORTANT: The AI API key must never live inside the mobile app.
 * All AI calls go through your own backend proxy (see /backend folder)
 * which holds the Claude API key securely server-side.
 */

const client = axios.create({
  baseURL: AI_PROXY_URL || 'http://localhost:3000/api/ai',
  timeout: 20000,
});

export async function sendChatMessage(
  messages: ChatMessage[],
  newUserMessage: string
): Promise<string> {
  const { data } = await client.post('/chat', {
    history: messages.map((m) => ({ role: m.role, content: m.content })),
    message: newUserMessage,
  });
  return data.reply as string;
}

export async function generateSignal(
  symbol: string,
  assetType: 'crypto' | 'stock',
  priceData: { price: number; changePercent24h: number }
): Promise<AISignal> {
  const { data } = await client.post('/signal', {
    symbol,
    assetType,
    priceData,
  });
  return {
    id: `${symbol}-${Date.now()}`,
    symbol,
    assetType,
    action: data.action,
    confidence: data.confidence,
    reasoning: data.reasoning,
    createdAt: new Date().toISOString(),
  };
}

export async function analyzeNewsSentiment(
  headlines: { headline: string; summary: string }[]
): Promise<Pick<NewsItem, 'sentiment'>[]> {
  const { data } = await client.post('/sentiment', { headlines });
  return data.results;
}
