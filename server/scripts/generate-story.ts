/**
 * Simulates AI story replenishment. Replace content with an OpenAI call (see README).
 * Scenes are generated from each paragraph so art matches the text.
 *
 *   cd server && npm run generate
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateScenesForStory } from '../../lib/generatePageScene.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, '..', 'data', 'catalog.json');
const SEED_PATH = path.join(__dirname, '..', 'data', 'seed-stories.json');

const THEMES = ['friendship', 'courage', 'kindness', 'adventure', 'nature', 'bedtime'] as const;
const EMOJIS = ['🦉', '🐢', '🌈', '🍄', '🦋', '⭐', '🐚', '🎈'];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40);
}

function buildStory() {
  const names = ['Pip', 'Nova', 'Willow', 'Finn', 'Zara', 'Ollie'];
  const creatures = ['hedgehog', 'cloud sprite', 'paper crane', 'lantern fish', 'acorn knight'];
  const hero = names[Math.floor(Math.random() * names.length)]!;
  const creature = creatures[Math.floor(Math.random() * creatures.length)]!;
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)]!;
  const title = `${hero} and the ${creature
    .split(' ')
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join(' ')}`;

  const content = [
    `${hero} woke to a soft glow at the window — a ${creature} needed help with a puzzle only kindness could solve.`,
    `The room smelled of morning bread and rain. ${hero} packed courage in a pocket and stepped outside.`,
    `Together they crossed a bridge made of questions. Every honest answer added a plank of light.`,
    `A wind tried to blow the bridge away. ${hero} held the ${creature}'s hand and said, "We can be scared and still keep going."`,
    `Halfway across they met a bird who had forgotten its song. They hummed until the bird remembered, note by note.`,
    `When they reached the other side, the ${creature} handed ${hero} a seed that hummed like a lullaby.`,
    `"Plant it where you feel brave," they said. ${hero} chose the school playground, and friends gathered to water it with laughter.`,
    `Some days the seed did nothing. Some days it trembled. ${hero} visited anyway, whispering encouragement like sunshine.`,
    `By dusk a tiny tree shimmered in the moonlight. Leaves spelled thank-you in a language only kind hearts could read.`,
    `${hero} smiled. Some magic grows best when it is shared — and some adventures are measured in small, steady steps.`,
  ];

  const id = `${slugify(title)}-${Date.now().toString(36)}`;
  const coverEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]!;

  const draft = {
    id,
    title,
    summary: `A ${theme} tale about ${hero} and a gentle adventure with a ${creature}.`,
    content,
    theme,
    ageMin: 4,
    ageMax: 9,
    readingMinutes: 8,
    createdAt: new Date().toISOString(),
    availableFrom: new Date().toISOString(),
    premiumOnly: Math.random() > 0.4,
    coverEmoji,
  };

  const scenes = generateScenesForStory(draft);
  return { ...draft, scenes };
}

function readCatalog() {
  if (fs.existsSync(CATALOG_PATH)) {
    const parsed = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
    if (parsed.stories?.length) return parsed;
  }
  if (fs.existsSync(SEED_PATH)) {
    return JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
  }
  return { stories: [], updatedAt: new Date().toISOString() };
}

function writeCatalog(catalog: { stories: unknown[]; updatedAt: string }) {
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
}

const story = buildStory();
const catalog = readCatalog();
catalog.stories.unshift(story);
catalog.updatedAt = new Date().toISOString();
writeCatalog(catalog);

console.log(`Generated: "${story.title}" (${story.id})`);
console.log(`Pages: ${story.content.length} — each with text-matched scene`);
console.log(`Catalog now has ${catalog.stories.length} stories.`);
