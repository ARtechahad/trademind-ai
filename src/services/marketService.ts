import axios from 'axios';
import { FINNHUB_API_KEY } from '@env';
import { Asset } from '@/types';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const FINNHUB_BASE = 'https://finnhub.io/api/v1';

/**
 * Fetch top crypto assets with 24h change and sparkline data.
 * CoinGecko's public API is free and does not require an API key.
 */
export async function fetchCryptoAssets(ids: string[] = [
  'bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano',
]): Promise<Asset[]> {
  const { data } = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
    params: {
      vs_currency: 'usd',
      ids: ids.join(','),
      sparkline: true,
      price_change_percentage: '24h',
    },
  });

  return data.map((coin: any) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    type: 'crypto' as const,
    price: coin.current_price,
    changePercent24h: coin.price_change_percentage_24h ?? 0,
    sparkline: coin.sparkline_in_7d?.price ?? [],
    imageUrl: coin.image,
  }));
}

/**
 * Fetch a single stock quote via Finnhub.
 * Requires FINNHUB_API_KEY set in .env (free tier available at finnhub.io).
 */
export async function fetchStockQuote(symbol: string): Promise<Asset | null> {
  if (!FINNHUB_API_KEY) {
    console.warn('FINNHUB_API_KEY missing - stock data will not load.');
    return null;
  }

  const { data } = await axios.get(`${FINNHUB_BASE}/quote`, {
    params: { symbol, token: FINNHUB_API_KEY },
  });

  if (!data || data.c === undefined) return null;

  const changePercent = data.pc ? ((data.c - data.pc) / data.pc) * 100 : 0;

  return {
    id: symbol,
    symbol,
    name: symbol,
    type: 'stock',
    price: data.c,
    changePercent24h: changePercent,
  };
}

export async function fetchStockAssets(symbols: string[] = [
  'AAPL', 'TSLA', 'MSFT', 'NVDA', 'AMZN',
]): Promise<Asset[]> {
  const results = await Promise.all(symbols.map(fetchStockQuote));
  return results.filter((a): a is Asset => a !== null);
}

export async function fetchAllAssets(): Promise<Asset[]> {
  const [crypto, stocks] = await Promise.all([
    fetchCryptoAssets().catch(() => []),
    fetchStockAssets().catch(() => []),
  ]);
  return [...crypto, ...stocks];
}
