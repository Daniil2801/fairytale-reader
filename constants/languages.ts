import type { AppLanguage, LanguageOption } from '@/types/language';

export const DEFAULT_TEXT_LANGUAGE: AppLanguage = 'en';
export const DEFAULT_VOICE_LANGUAGE: AppLanguage = 'en';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', nativeLabel: 'English', englishLabel: 'English', speechLocale: 'en-US' },
  { code: 'es', nativeLabel: 'Español', englishLabel: 'Spanish', speechLocale: 'es-ES' },
  { code: 'fr', nativeLabel: 'Français', englishLabel: 'French', speechLocale: 'fr-FR' },
  { code: 'de', nativeLabel: 'Deutsch', englishLabel: 'German', speechLocale: 'de-DE' },
  { code: 'pt', nativeLabel: 'Português', englishLabel: 'Portuguese', speechLocale: 'pt-BR' },
  { code: 'ru', nativeLabel: 'Русский', englishLabel: 'Russian', speechLocale: 'ru-RU' },
];

export function getLanguageOption(code: AppLanguage): LanguageOption {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? SUPPORTED_LANGUAGES[0];
}

export function getSpeechLocale(code: AppLanguage): string {
  return getLanguageOption(code).speechLocale;
}

export function isAppLanguage(value: string): value is AppLanguage {
  return SUPPORTED_LANGUAGES.some((l) => l.code === value);
}
