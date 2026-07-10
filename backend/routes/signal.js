const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a market analysis engine. Given a symbol, asset type, and
recent price data, respond with ONLY a JSON object (no markdown, no preamble) in this
exact shape:
{"action": "BUY" | "SELL" | "HOLD", "confidence": "LOW" | "MEDIUM" | "HIGH", "reasoning": "one or two sentence explanation"}
This is for educational/informational purposes only, not financial advice.`;

router.post('/', async (req, res) => {
  try {
    const { symbol, assetType, priceData } = req.body;

    if (!symbol || !priceData) {
      return res.status(400).json({ error: 'symbol and priceData are required' });
    }

    const userPrompt = `Symbol: ${symbol}\nAsset type: ${assetType}\nCurrent price: ${priceData.price}\n24h change: ${priceData.changePercent24h}%`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();

    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (err) {
    console.error('Signal route error:', err);
    res.status(500).json({ error: 'Failed to generate signal' });
  }
});

module.exports = router;
