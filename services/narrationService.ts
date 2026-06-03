import * as Speech from 'expo-speech';

import { getSpeechLocale } from '@/constants/languages';
import type { AppLanguage } from '@/types/language';

export type NarrationStatus = 'idle' | 'speaking' | 'paused';

let speaking = false;

export function isNarrating(): boolean {
  return speaking;
}

export async function stopNarration(): Promise<void> {
  speaking = false;
  await Speech.stop();
}

export function speak(
  text: string,
  options: {
    onStart?: () => void;
    onDone?: () => void;
    onStopped?: () => void;
    onError?: () => void;
    rate?: number;
    language?: AppLanguage;
  } = {},
): void {
  void stopNarration().then(() => {
    speaking = true;
    options.onStart?.();

    Speech.speak(text, {
      language: getSpeechLocale(options.language ?? 'en'),
      pitch: 1.05,
      rate: options.rate ?? 0.82,
      onStart: () => {
        speaking = true;
      },
      onDone: () => {
        speaking = false;
        options.onDone?.();
      },
      onStopped: () => {
        speaking = false;
        options.onStopped?.();
      },
      onError: () => {
        speaking = false;
        options.onError?.();
      },
    });
  });
}

export async function pauseNarration(): Promise<void> {
  if (speaking) {
    await Speech.pause();
    speaking = false;
  }
}

export async function resumeNarration(): Promise<void> {
  await Speech.resume();
  speaking = true;
}
