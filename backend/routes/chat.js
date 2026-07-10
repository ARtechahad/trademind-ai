const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a helpful trading and investing assistant inside a mobile app
called TradeMind AI. You help users understand crypto and stock markets, explain concepts,
and discuss strategy. You are NOT a licensed financial advisor - always remind users that
your responses are informational, not financial advice, when giving anything resembling
a recommendation. Keep answers concise and mobile-friendly (short paragraphs).`;

router.post('/', async (req, res) => {
  try {
    const { history = [], message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [...history, { role: 'user', content: message }],
    });

    const reply = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    res.json({ reply });
  } catch (err) {
    console.error('Chat route error:', err);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

module.exports = router;
