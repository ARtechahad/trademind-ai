require('dotenv').config();
const express = require('express');
const cors = require('cors');

const chatRoute = require('./routes/chat');
const signalRoute = require('./routes/signal');
const sentimentRoute = require('./routes/sentiment');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/ai/chat', chatRoute);
app.use('/api/ai/signal', signalRoute);
app.use('/api/ai/sentiment', sentimentRoute);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TradeMind AI backend running on port ${PORT}`);
});
