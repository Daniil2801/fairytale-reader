/** App UI + story text locales */
export type AppLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ru';

export interface LanguageOption {
  code: AppLanguage;
  /** UI label in the language itself */
  nativeLabel: string;
  /** English label for parents */
  englishLabel: string;
  /** BCP-47 tag for expo-speech */
  speechLocale: string;
}

export interface StoryTranslation {
  title: string;
  summary: string;
  content: string[];
}

export type StoryTranslationCatalog = Partial<
  Record<AppLanguage, Partial<Record<string, StoryTranslation>>>
>;
