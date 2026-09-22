import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const deals = [
  {
    id: 1,
    title: 'Summer Tech Bundle',
    category: 'Electronics',
    price: '$249',
    description: 'A curated bundle of wireless headphones, earbuds, and a power bank for everyday shopping.'
  },
  {
    id: 2,
    title: 'Home Office Refresh',
    category: 'Furniture',
    price: '$399',
    description: 'Upgrade your workspace with a compact desk, ergonomic chair, and smart lamp for modern living.'
  },
  {
    id: 3,
    title: 'Weekend Getaway Pack',
    category: 'Travel',
    price: '$179',
    description: 'Pack light with a luggage set, travel pillow, and waterproof organizer for your next trip.'
  }
];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Big Deal e-commerce API is running' });
});

app.get('/api/deals', (_req, res) => {
  res.json(deals);
});

app.get('/api/deals/:id', (req, res) => {
  const deal = deals.find((item) => item.id === Number(req.params.id));

  if (!deal) {
    return res.status(404).json({ message: 'Deal not found' });
  }

  res.json(deal);
});

app.listen(PORT, () => {
  console.log(`Big Deal backend listening on port ${PORT}`);
});
