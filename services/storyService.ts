import { API_BASE_URL } from '@/constants/config';
import { SEED_STORIES } from '@/data/seedStories';
import { isAvailable } from '@/lib/dates';
import type { Story, StoryCatalog } from '@/types/story';

let cachedCatalog: Story[] | null = null;

async function fetchRemoteCatalog(): Promise<Story[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/stories`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as StoryCatalog;
    return data.stories?.length ? data.stories : null;
  } catch {
    return null;
  }
}

export async function getStories(): Promise<Story[]> {
  if (!cachedCatalog) {
    const remote = await fetchRemoteCatalog();
    cachedCatalog = remote?.length ? remote : SEED_STORIES;
  }
  return [...cachedCatalog].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function refreshStories(): Promise<Story[]> {
  const remote = await fetchRemoteCatalog();
  if (remote?.length) {
    cachedCatalog = remote;
  }
  return getStories();
}

export function invalidateStoryCache(): void {
  cachedCatalog = null;
}

export async function getStoryById(id: string): Promise<Story | undefined> {
  const stories = await getStories();
  return stories.find((s) => s.id === id);
}

export function isStoryReleased(story: Story): boolean {
  return isAvailable(story.availableFrom);
}

export function getReleasedStories(stories: Story[]): Story[] {
  return stories.filter(isStoryReleased);
}

export function getFreeStoriesThisWeek(stories: Story[]): Story[] {
  return getReleasedStories(stories).filter((s) => !s.premiumOnly);
}

export function getPremiumStories(stories: Story[]): Story[] {
  return getReleasedStories(stories).filter((s) => s.premiumOnly);
}

export function getUpcomingStories(stories: Story[]): Story[] {
  return stories.filter((s) => !isStoryReleased(s));
}
