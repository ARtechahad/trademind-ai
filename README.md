# TradeMind AI — Trading Assistant App

A React Native (Expo) app for tracking crypto + stocks, with AI-powered chat,
trading signals, and news sentiment analysis. Backed by Supabase (auth + database).

## Features

- 📈 **Markets** — live crypto (CoinGecko) and stock (Finnhub) prices, sparkline charts
- 🤖 **AI Assistant** — chat with an AI about markets, strategy, and concepts
- ⚡ **AI Signals** — BUY/SELL/HOLD signals with reasoning, generated per asset
- 📰 **News** — market headlines tagged with AI sentiment (positive/negative/neutral)
- 🔐 **Auth** — Supabase email/password login
- 💾 **Database** — watchlist and chat history persisted per user (Postgres via Supabase)

## Project structure

```
trading-ai-app/
├── App.tsx                  # Entry point
├── src/
│   ├── navigation/           # Auth + main tab navigators
│   ├── screens/               # All screens (Auth, Dashboard, Markets, AIAssistant, Signals, News, Profile)
│   ├── services/               # supabase.ts, marketService.ts, aiService.ts, newsService.ts, watchlistService.ts
│   ├── context/                 # AuthContext (Supabase session)
│   ├── components/               # PriceCard, SignalCard, ChatBubble, NewsCard
│   ├── constants/theme.ts         # Colors, spacing, typography
│   └── types/                      # Shared TypeScript types
├── supabase/schema.sql        # Database schema + RLS policies
└── backend/                    # Express proxy server that calls the Claude API securely
    ├── server.js
    └── routes/ (chat.js, signal.js, sentiment.js)
```

## Why is there a `backend/` folder?

**Never put an AI API key inside a mobile app** — anyone can decompile the app and
steal it. The `backend/` folder is a small Express server that holds your
`ANTHROPIC_API_KEY` securely and exposes three endpoints the app calls instead:

- `POST /api/ai/chat` — conversational assistant
- `POST /api/ai/signal` — BUY/SELL/HOLD signal generation
- `POST /api/ai/sentiment` — news sentiment classification

## Setup

### 1. Backend (AI proxy)

```bash
cd backend
npm install
cp .env.example .env
# edit .env and add your ANTHROPIC_API_KEY
npm start
```

This runs on `http://localhost:3000` by default. For a real device/app you'll need
to deploy this somewhere reachable (Render, Railway, Fly.io, a VPS, etc.) and point
`AI_PROXY_URL` at it.

### 2. Supabase (database + auth)

1. Create a free project at [supabase.com](https://supabase.com)
2. In the SQL editor, run `supabase/schema.sql`
3. Copy your Project URL and anon/public key from Project Settings → API

### 3. Mobile app

```bash
npm install
cp .env.example .env
# edit .env: SUPABASE_URL, SUPABASE_ANON_KEY, AI_PROXY_URL, FINNHUB_API_KEY
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `a` / `i`
for an emulator.

### 4. Get free API keys

- **Finnhub** (stock prices + news): [finnhub.io](https://finnhub.io) — free tier
- **CoinGecko** (crypto prices): no key needed, public API
- **Anthropic** (Claude API for the backend): [console.anthropic.com](https://console.anthropic.com)

## Notes

- All AI-generated signals include a disclaimer — this is informational content,
  not financial advice. Consider keeping that disclaimer visible in any production version.
- Row Level Security (RLS) is enabled on all Supabase tables so users can only see
  their own watchlist/chat data.
- To add more crypto or stock symbols, edit the default lists in
  `src/services/marketService.ts`.
