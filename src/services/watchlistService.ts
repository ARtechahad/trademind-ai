import { supabase } from './supabase';
import { AssetType, WatchlistItem } from '@/types';

export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as WatchlistItem[];
}

export async function addToWatchlist(
  userId: string,
  symbol: string,
  assetType: AssetType,
  assetId: string
) {
  const { error } = await supabase.from('watchlist').insert({
    user_id: userId,
    symbol,
    asset_type: assetType,
    asset_id: assetId,
  });
  if (error) throw error;
}

export async function removeFromWatchlist(itemId: string) {
  const { error } = await supabase.from('watchlist').delete().eq('id', itemId);
  if (error) throw error;
}

export async function saveChatMessage(userId: string, role: 'user' | 'assistant', content: string) {
  const { error } = await supabase.from('chat_messages').insert({
    user_id: userId,
    role,
    content,
  });
  if (error) console.warn('Failed to persist chat message:', error.message);
}

export async function getChatHistory(userId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) throw error;
  return data;
}
