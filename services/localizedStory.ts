import { STORY_TRANSLATIONS } from '@/data/translations';
import type { AppLanguage, StoryTranslation } from '@/types/language';
import type { Story } from '@/types/story';

export function hasTranslation(storyId: string, lang: AppLanguage): boolean {
  if (lang === 'en') return true;
  return Boolean(STORY_TRANSLATIONS[lang]?.[storyId]);
}

export function getStoryTranslation(
  storyId: string,
  lang: AppLanguage,
): StoryTranslation | null {
  if (lang === 'en') return null;
  return STORY_TRANSLATIONS[lang]?.[storyId] ?? null;
}

/** Merge translated pages with English tail when catalog grew after translations shipped. */
function mergeStoryContent(base: string[], translated: string[]): string[] {
  if (translated.length >= base.length) return translated.slice(0, base.length);
  return [...translated, ...base.slice(translated.length)];
}

/** Story with title, summary, and pages in the requested language (English fallback). */
export function localizeStory(story: Story, lang: AppLanguage): Story {
  if (lang === 'en') return story;

  const translation = getStoryTranslation(story.id, lang);
  if (!translation) return story;

  return {
    ...story,
    title: translation.title,
    summary: translation.summary,
    content: mergeStoryContent(story.content, translation.content),
  };
}

export function isUsingTranslationFallback(story: Story, lang: AppLanguage): boolean {
  return lang !== 'en' && !hasTranslation(story.id, lang);
}
