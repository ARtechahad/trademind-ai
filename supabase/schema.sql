-- Run this in the Supabase SQL editor to set up your database.

-- Watchlist: assets each user is tracking
create table if not exists watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  asset_id text not null,
  asset_type text check (asset_type in ('crypto', 'stock')) not null,
  symbol text not null,
  created_at timestamptz default now()
);

-- Chat history for the AI assistant
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Saved AI-generated trading signals (optional history/audit trail)
create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  symbol text not null,
  asset_type text check (asset_type in ('crypto', 'stock')) not null,
  action text check (action in ('BUY', 'SELL', 'HOLD')) not null,
  confidence text check (confidence in ('LOW', 'MEDIUM', 'HIGH')) not null,
  reasoning text,
  created_at timestamptz default now()
);

-- Row Level Security: users can only see/manage their own data
alter table watchlist enable row level security;
alter table chat_messages enable row level security;
alter table signals enable row level security;

create policy "Users manage their own watchlist"
  on watchlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own chat messages"
  on chat_messages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own signals"
  on signals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
