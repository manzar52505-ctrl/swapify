const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (replace with database later)
let items = [
  {
    id: '1',
    name: 'iPhone 13 Pro',
    price: 899,
    category: 'Electronics',
    description: 'Excellent condition iPhone',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    owner: 'JohnDoe',
    status: 'Available',
    location: 'New York',
    condition: 'Like New',
    createdAt: new Date().toISOString()
  }
];
let users = [];
let swaps = [];

// API Routes
app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const item = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  items.push(item);
  res.json(item);
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

app.post('/api/swaps', (req, res) => {
  const swap = {
    id: Date.now().toString(),
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  swaps.push(swap);
  res.json(swap);
});

app.get('/api/swaps', (req, res) => {
  res.json(swaps);
});

app.delete('/api/items/:id', (req, res) => {
  items = items.filter(item => item.id !== req.params.id);
  res.json({ success: true });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Mobile access: http://[YOUR_PC_IP]:${PORT}`);
});