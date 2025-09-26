const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory card collection
let cards = [
  { id: 1, suit: 'Hearts', value: 'Ace' },
  { id: 2, suit: 'Spades', value: 'King' }
];
let nextId = 3;

// GET /cards - list all cards
app.get('/cards', (req, res) => {
  res.json(cards);
});

// POST /cards - add a new card
app.post('/cards', (req, res) => {
  const { suit, value } = req.body;
  if (!suit || !value) {
    return res.status(400).json({ error: 'suit and value are required' });
  }
  const newCard = { id: nextId++, suit, value };
  cards.push(newCard);
  res.status(201).json(newCard);
});

// GET /cards/:id - get a card by ID
app.get('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });
  const card = cards.find(c => c.id === id);
  if (!card) return res.status(404).json({ error: 'card not found' });
  res.json(card);
});

// PUT /cards/:id - replace a card (requires suit and value)
app.put('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { suit, value } = req.body;
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });
  if (!suit || !value) return res.status(400).json({ error: 'suit and value are required' });

  const idx = cards.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'card not found' });

  cards[idx] = { id, suit, value };
  res.json(cards[idx]);
});

// PATCH /cards/:id - update part of a card
app.patch('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

  const card = cards.find(c => c.id === id);
  if (!card) return res.status(404).json({ error: 'card not found' });

  const { suit, value } = req.body;
  if (suit !== undefined) card.suit = suit;
  if (value !== undefined) card.value = value;

  res.json(card);
});

// DELETE /cards/:id - delete a card
app.delete('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

  const idx = cards.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'card not found' });

  const removed = cards.splice(idx, 1)[0];
  res.json({ message: 'card deleted', card: removed });
});

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(⁠ Playing Card API running at http://localhost:${PORT} ⁠);
});
