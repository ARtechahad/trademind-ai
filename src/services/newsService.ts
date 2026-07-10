import axios from 'axios';
import { FINNHUB_API_KEY } from '@env';
import { NewsItem } from '@/types';
import { analyzeNewsSentiment } from './aiService';

const FINNHUB_BASE = 'https://finnhub.io/api/v1';

export async function fetchMarketNews(): Promise<NewsItem[]> {
  if (!FINNHUB_API_KEY) {
    console.warn('FINNHUB_API_KEY missing - news will not load.');
    return [];
  }

  const { data } = await axios.get(`${FINNHUB_BASE}/news`, {
    params: { category: 'general', token: FINNHUB_API_KEY },
  });

  const top = data.slice(0, 15);

  const sentiments = await analyzeNewsSentiment(
    top.map((n: any) => ({ headline: n.headline, summary: n.summary }))
  ).catch(() => top.map(() => ({ sentiment: 'neutral' as const })));

  return top.map((n: any, i: number) => ({
    id: String(n.id),
    headline: n.headline,
    summary: n.summary,
    source: n.source,
    url: n.url,
    publishedAt: new Date(n.datetime * 1000).toISOString(),
    sentiment: sentiments[i]?.sentiment ?? 'neutral',
    relatedSymbols: n.related ? n.related.split(',').filter(Boolean) : [],
  }));
}
