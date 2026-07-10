const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a financial news sentiment classifier. Given a list of
headlines with summaries, respond with ONLY a JSON object (no markdown) in this shape:
{"results": [{"sentiment": "positive" | "negative" | "neutral"}, ...]}
The results array must be in the same order as the input headlines.`;

router.post('/', async (req, res) => {
  try {
    const { headlines } = req.body;

    if (!Array.isArray(headlines) || headlines.length === 0) {
      return res.status(400).json({ error: 'headlines array is required' });
    }

    const userPrompt = headlines
      .map((h, i) => `${i + 1}. ${h.headline} - ${h.summary}`)
      .join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
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
    console.error('Sentiment route error:', err);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

module.exports = router;
