export type AssetType = 'crypto' | 'stock';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  changePercent24h: number;
  sparkline?: number[];
  imageUrl?: string;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  asset_id: string;
  asset_type: AssetType;
  symbol: string;
  created_at: string;
}

export type SignalAction = 'BUY' | 'SELL' | 'HOLD';
export type SignalConfidence = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AISignal {
  id: string;
  symbol: string;
  assetType: AssetType;
  action: SignalAction;
  confidence: SignalConfidence;
  reasoning: string;
  createdAt: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedSymbols: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
}
