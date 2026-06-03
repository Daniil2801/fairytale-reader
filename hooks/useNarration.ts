import { useCallback, useEffect, useRef, useState } from 'react';

import * as narration from '@/services/narrationService';
import type { AppLanguage } from '@/types/language';

type Options = {
  text: string;
  voiceLanguage: AppLanguage;
  enabled: boolean;
  autoAdvance: boolean;
  onFinished?: () => void;
};

export function useNarration({
  text,
  voiceLanguage,
  enabled,
  autoAdvance,
  onFinished,
}: Options) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const textRef = useRef(text);
  const onFinishedRef = useRef(onFinished);
  textRef.current = text;
  onFinishedRef.current = onFinished;

  const stop = useCallback(async () => {
    await narration.stopNarration();
    setIsSpeaking(false);
  }, []);

  const speakCurrent = useCallback(() => {
    const toSpeak = textRef.current;
    if (!toSpeak.trim() || !enabled) return;

    narration.speak(toSpeak, {
      language: voiceLanguage,
      onStart: () => setIsSpeaking(true),
      onDone: () => {
        setIsSpeaking(false);
        if (autoAdvance && autoPlay) {
          onFinishedRef.current?.();
        }
      },
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [autoAdvance, autoPlay, enabled, voiceLanguage]);

  const togglePlay = useCallback(async () => {
    if (isSpeaking) {
      await stop();
      return;
    }
    speakCurrent();
  }, [isSpeaking, speakCurrent, stop]);

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((v) => !v);
  }, []);

  useEffect(() => {
    if (!enabled) {
      void stop();
    }
  }, [enabled, stop]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await narration.stopNarration();
      if (cancelled) return;
      setIsSpeaking(false);
      if (autoPlay && enabled && text.trim()) {
        speakCurrent();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [text, autoPlay, enabled, speakCurrent, voiceLanguage]);

  useEffect(() => {
    return () => {
      void narration.stopNarration();
    };
  }, []);

  return {
    isSpeaking,
    autoPlay,
    togglePlay,
    toggleAutoPlay,
    stop,
    speakCurrent,
  };
}
