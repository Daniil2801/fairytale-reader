import { generatePageScene, generateScenesForStory } from '@/lib/generatePageScene';
import type { Story, StoryScene } from '@/types/story';

/**
 * Scenes are always derived from each page's paragraph so art & motion
 * match what the child is reading. Explicit `story.scenes` are merged
 * field-by-field only when provided for every page (e.g. AI pipeline).
 */
export function getScenesForStory(story: Story): StoryScene[] {
  const generated = generateScenesForStory(story);

  if (!story.scenes?.length) {
    return generated;
  }

  if (story.scenes.length !== story.content.length) {
    return generated;
  }

  return story.scenes.map((override, i) => ({
    ...generated[i],
    ...override,
    emojis: override.emojis?.length ? override.emojis : generated[i].emojis,
    imageUrl: override.imageUrl ?? generated[i].imageUrl,
    momentLabel: override.momentLabel ?? generated[i].momentLabel,
  }));
}

export function getSceneForPage(story: Story, pageIndex: number): StoryScene {
  const scenes = getScenesForStory(story);
  return scenes[pageIndex] ?? generatePageScene(story, story.content[pageIndex], pageIndex);
}

export function getNarrationText(story: Story, pageIndex: number): string {
  if (pageIndex === 0) {
    return `${story.title}. ${story.content[0]}`;
  }
  return story.content[pageIndex];
}

export { generatePageScene, generateScenesForStory };
