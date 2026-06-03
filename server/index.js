import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import paymentRoutes, { registerCheckoutPage } from './payments/routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, 'data', 'catalog.json');
const SEED_PATH = path.join(__dirname, 'data', 'seed-stories.json');

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

function readCatalog() {
  if (fs.existsSync(CATALOG_PATH)) {
    const raw = fs.readFileSync(CATALOG_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed.stories?.length) return parsed;
  }
  if (fs.existsSync(SEED_PATH)) {
    const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
    return seed;
  }
  return { stories: [], updatedAt: new Date().toISOString() };
}

function writeCatalog(catalog) {
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/stories', (_req, res) => {
  const catalog = readCatalog();
  res.json(catalog);
});

app.get('/api/stories/:id', (req, res) => {
  const catalog = readCatalog();
  const story = catalog.stories.find((s) => s.id === req.params.id);
  if (!story) {
    res.status(404).json({ error: 'Story not found' });
    return;
  }
  res.json(story);
});

/** Admin/cron: append a generated story (protect with API_KEY in production) */
app.post('/api/stories', (req, res) => {
  const apiKey = process.env.ADMIN_API_KEY;
  if (apiKey && req.headers['x-api-key'] !== apiKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const story = req.body;
  if (!story?.id || !story?.title || !Array.isArray(story?.content)) {
    res.status(400).json({ error: 'Invalid story payload' });
    return;
  }

  const catalog = readCatalog();
  if (catalog.stories.some((s) => s.id === story.id)) {
    res.status(409).json({ error: 'Story already exists' });
    return;
  }

  catalog.stories.unshift({
    ...story,
    createdAt: story.createdAt ?? new Date().toISOString(),
    availableFrom: story.availableFrom ?? new Date().toISOString(),
  });
  catalog.updatedAt = new Date().toISOString();
  writeCatalog(catalog);
  res.status(201).json(story);
});

registerCheckoutPage(app);
app.use('/api/payments', paymentRoutes);

app.listen(PORT, () => {
  console.log(`Fairytale API listening on http://localhost:${PORT}`);
});
