import {
  SCENE_IMAGE_BY_KEY,
  TEXT_TO_ANIMATION,
  TEXT_TO_EMOJIS,
  TEXT_TO_GRADIENT,
  TEXT_TO_VISUAL_KEY,
  THEME_FALLBACK_GRADIENT,
} from '@/constants/pageSceneConfig';
import type { SceneAnimation, Story, StoryScene } from '@/types/story';

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function matchBest<T extends { pattern: RegExp; priority: number }>(
  text: string,
  rules: T[],
  pick: (rule: T) => unknown,
): unknown | null {
  let best: { value: unknown; priority: number } | null = null;
  for (const rule of rules) {
    if (!rule.pattern.test(text)) continue;
    const value = pick(rule);
    if (!best || rule.priority > best.priority) {
      best = { value, priority: rule.priority };
    }
  }
  return best?.value ?? null;
}

function matchAllEmojis(text: string): string[] {
  const found: { emojis: string[]; priority: number }[] = [];
  for (const rule of TEXT_TO_EMOJIS) {
    if (rule.pattern.test(text)) {
      found.push({ emojis: rule.emojis, priority: rule.priority });
    }
  }
  found.sort((a, b) => b.priority - a.priority);
  const out: string[] = [];
  for (const f of found) {
    for (const e of f.emojis) {
      if (!out.includes(e) && out.length < 4) out.push(e);
    }
  }
  return out;
}

function visualKeyForText(text: string): string {
  const key = matchBest(text, TEXT_TO_VISUAL_KEY, (r) => r.key) as string | null;
  return key ?? 'default_nature';
}

function imageForKey(
  key: string,
  storyId: string,
  pageIndex: number,
  paragraph: string,
): string {
  const pool = SCENE_IMAGE_BY_KEY[key] ?? SCENE_IMAGE_BY_KEY.default_nature;
  const idx = hashString(`${storyId}:${pageIndex}:${key}:${paragraph}`) % pool.length;
  return pool[idx];
}

function momentLabelFromParagraph(paragraph: string): string {
  const cleaned = paragraph.replace(/^["“]|["”]$/g, '').trim();
  if (cleaned.length <= 52) return cleaned;
  const cut = cleaned.slice(0, 49).trim();
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 20 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function protagonistName(story: Story): string | null {
  const fromTitle = story.title.match(/^([A-Z][a-z]+)/);
  if (fromTitle) return fromTitle[1]!;
  const fromBody = story.content[0]?.match(/\b([A-Z][a-z]+) the /);
  return fromBody?.[1] ?? null;
}

/** Hero emoji when the protagonist is mentioned on this page */
function extractHeroEmojis(story: Story, paragraph: string): string[] {
  const name = protagonistName(story);
  if (name && new RegExp(`\\b${name}\\b`).test(paragraph)) {
    return [story.coverEmoji];
  }
  if (paragraph === story.content[0]) {
    return [story.coverEmoji];
  }
  return [];
}

export function generatePageScene(
  story: Story,
  paragraph: string,
  pageIndex: number,
): StoryScene {
  const lower = paragraph.toLowerCase();
  const visualKey = visualKeyForText(lower);

  const textEmojis = matchAllEmojis(lower);
  const heroEmojis = extractHeroEmojis(story, paragraph);
  const emojis: string[] = [];
  for (const e of [...heroEmojis, ...textEmojis]) {
    if (!emojis.includes(e) && emojis.length < 3) emojis.push(e);
  }
  while (emojis.length < 2) {
    emojis.push(textEmojis[emojis.length] ?? story.coverEmoji);
  }

  const animation =
    (matchBest(lower, TEXT_TO_ANIMATION, (r) => r.animation) as SceneAnimation | null) ??
    'float';

  const gradient =
    (matchBest(lower, TEXT_TO_GRADIENT, (r) => r.gradient) as [string, string] | null) ??
    THEME_FALLBACK_GRADIENT[story.theme] ??
    ['#312e81', '#8b5cf6'];

  return {
    emojis: emojis.slice(0, 3),
    gradient,
    animation,
    imageUrl: imageForKey(visualKey, story.id, pageIndex, paragraph),
    momentLabel: momentLabelFromParagraph(paragraph),
    visualKey,
  };
}

export function generateScenesForStory(story: Story): StoryScene[] {
  return story.content.map((paragraph, i) => generatePageScene(story, paragraph, i));
}
