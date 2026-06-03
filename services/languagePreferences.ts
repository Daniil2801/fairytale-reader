import { DEFAULT_TEXT_LANGUAGE, DEFAULT_VOICE_LANGUAGE, isAppLanguage } from '@/constants/languages';
import { getJson, setJson } from '@/lib/storage';
import type { AppLanguage } from '@/types/language';

const TEXT_KEY = '@fairytale/textLanguage';
const VOICE_KEY = '@fairytale/voiceLanguage';
const VOICE_FOLLOWS_TEXT_KEY = '@fairytale/voiceFollowsText';

export interface LanguagePreferences {
  textLanguage: AppLanguage;
  voiceLanguage: AppLanguage;
  voiceFollowsText: boolean;
}

function parseLang(value: unknown, fallback: AppLanguage): AppLanguage {
  if (value === 'uk') return 'ru';
  return typeof value === 'string' && isAppLanguage(value) ? value : fallback;
}

export async function loadLanguagePreferences(): Promise<LanguagePreferences> {
  const [text, voice, follows] = await Promise.all([
    getJson<AppLanguage | null>(TEXT_KEY, null),
    getJson<AppLanguage | null>(VOICE_KEY, null),
    getJson<boolean>(VOICE_FOLLOWS_TEXT_KEY, true),
  ]);

  const textLanguage = parseLang(text, DEFAULT_TEXT_LANGUAGE);
  const voiceFollowsText = follows ?? true;
  const voiceLanguage = voiceFollowsText
    ? textLanguage
    : parseLang(voice, DEFAULT_VOICE_LANGUAGE);

  return { textLanguage, voiceLanguage, voiceFollowsText };
}

export async function saveTextLanguage(lang: AppLanguage): Promise<LanguagePreferences> {
  const current = await loadLanguagePreferences();
  await setJson(TEXT_KEY, lang);
  const voiceLanguage = current.voiceFollowsText ? lang : current.voiceLanguage;
  if (current.voiceFollowsText) {
    await setJson(VOICE_KEY, lang);
  }
  return { ...current, textLanguage: lang, voiceLanguage };
}

export async function saveVoiceLanguage(lang: AppLanguage): Promise<LanguagePreferences> {
  await setJson(VOICE_KEY, lang);
  await setJson(VOICE_FOLLOWS_TEXT_KEY, false);
  const current = await loadLanguagePreferences();
  return { ...current, voiceLanguage: lang, voiceFollowsText: false };
}

export async function setVoiceFollowsText(follows: boolean): Promise<LanguagePreferences> {
  await setJson(VOICE_FOLLOWS_TEXT_KEY, follows);
  const current = await loadLanguagePreferences();
  if (follows) {
    await setJson(VOICE_KEY, current.textLanguage);
    return {
      ...current,
      voiceFollowsText: true,
      voiceLanguage: current.textLanguage,
    };
  }
  return { ...current, voiceFollowsText: false };
}
