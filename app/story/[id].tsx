import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguagePicker } from '@/components/LanguagePicker';
import { NarrationBar } from '@/components/NarrationBar';
import { StorySceneView } from '@/components/StorySceneView';
import { getLanguageOption } from '@/constants/languages';
import { FairytaleTheme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import { useNarration } from '@/hooks/useNarration';
import { getNarrationText, getSceneForPage } from '@/lib/storyScenes';
import { isUsingTranslationFallback } from '@/services/localizedStory';
import { getStoryById } from '@/services/storyService';
import type { Story } from '@/types/story';

export default function StoryReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    openStory,
    localize,
    voiceLanguage,
    textLanguage,
    voiceFollowsText,
    setTextLanguage,
    setVoiceLanguage,
    ui,
  } = useApp();
  const [baseStory, setBaseStory] = useState<Story | null>(null);
  const [page, setPage] = useState(0);
  const [granted, setGranted] = useState(false);

  const story = useMemo(
    () => (baseStory ? localize(baseStory) : null),
    [baseStory, localize],
  );

  const showFallback =
    baseStory !== null && isUsingTranslationFallback(baseStory, textLanguage);

  useEffect(() => {
    let cancelled = false;
    setPage(0);
    setGranted(false);
    (async () => {
      const s = await getStoryById(id);
      if (cancelled || !s) return;
      const result = await openStory(s.id);
      if (!result.ok) {
        router.replace({
          pathname: '/subscribe',
          params: { reason: result.reason ?? 'weekly_limit', storyId: s.id },
        });
        return;
      }
      setBaseStory(s);
      setGranted(true);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, openStory, router]);

  const totalPages = story?.content.length ?? 0;
  const isLast = story ? page >= totalPages - 1 : false;

  const goNextPage = useCallback(() => {
    if (!story) return;
    if (page < story.content.length - 1) {
      setPage((p) => p + 1);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [page, story]);

  const narrationText = story ? getNarrationText(story, page) : '';

  const { isSpeaking, autoPlay, togglePlay, toggleAutoPlay, stop } = useNarration({
    text: narrationText,
    voiceLanguage,
    enabled: granted && !!story,
    autoAdvance: true,
    onFinished: goNextPage,
  });

  const handleNext = useCallback(async () => {
    await stop();
    if (isLast) {
      router.back();
      return;
    }
    goNextPage();
  }, [goNextPage, isLast, router, stop]);

  const handleBack = useCallback(async () => {
    await stop();
    router.back();
  }, [router, stop]);

  if (!story || !granted) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingEmoji}>📖</Text>
        <Text style={styles.loadingText}>{ui('reader.opening')}</Text>
      </View>
    );
  }

  const scene = getSceneForPage(story, page);
  const voiceLabel = getLanguageOption(voiceLanguage).nativeLabel;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12}>
          <Text style={styles.back}>{ui('reader.back')}</Text>
        </Pressable>
        <Text style={styles.progress}>
          {page + 1} / {totalPages}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.reader}>
        {showFallback && (
          <View style={styles.fallbackBanner}>
            <Text style={styles.fallbackText}>{ui('reader.fallbackBanner')}</Text>
          </View>
        )}

        {scene ? <StorySceneView scene={scene} pageKey={page} /> : null}

        <View style={styles.langSection}>
          <LanguagePicker
            label={ui('profile.storyLanguage')}
            selected={textLanguage}
            onSelect={(code) => void setTextLanguage(code)}
            compact
          />
          {!voiceFollowsText && (
            <LanguagePicker
              label={`${ui('profile.voiceLanguage')} (${voiceLabel})`}
              selected={voiceLanguage}
              onSelect={(code) => void setVoiceLanguage(code)}
              compact
            />
          )}
        </View>

        <NarrationBar
          isSpeaking={isSpeaking}
          autoPlay={autoPlay}
          onTogglePlay={togglePlay}
          onToggleAutoPlay={toggleAutoPlay}
          listenLabel={ui('narration.listen')}
          stopLabel={ui('narration.stop')}
          autoReadLabel={ui('narration.autoRead')}
          hint={ui('narration.hint')}
        />

        {page === 0 && (
          <Animated.Text entering={FadeIn.duration(400)} style={styles.title}>
            {story.title}
          </Animated.Text>
        )}
        <Animated.Text
          key={`p-${page}`}
          entering={FadeInUp.duration(380).springify().damping(16)}
          style={[styles.paragraph, isSpeaking && styles.paragraphActive]}>
          {story.content[page]}
        </Animated.Text>
      </ScrollView>

      <View style={styles.footer}>
        {!isLast ? (
          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>{ui('reader.next')}</Text>
          </Pressable>
        ) : (
          <View style={styles.endBlock}>
            <Text style={styles.endTitle}>{ui('reader.end')}</Text>
            <Text style={styles.endSub}>{ui('reader.endSub')}</Text>
            <Pressable style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>{ui('reader.back')}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FairytaleTheme.background,
  },
  loadingEmoji: {
    fontSize: 48,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: FairytaleTheme.textMuted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  back: {
    fontSize: 16,
    fontWeight: '600',
    color: FairytaleTheme.primary,
  },
  progress: {
    fontSize: 14,
    color: FairytaleTheme.textMuted,
    fontWeight: '600',
  },
  reader: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  fallbackBanner: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFCC80',
  },
  fallbackText: {
    fontSize: 12,
    color: '#E65100',
    textAlign: 'center',
    fontWeight: '600',
  },
  langSection: {
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: FairytaleTheme.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  paragraph: {
    fontSize: 20,
    lineHeight: 32,
    color: FairytaleTheme.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  paragraphActive: {
    color: FairytaleTheme.primaryDark,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: FairytaleTheme.border,
    backgroundColor: FairytaleTheme.surface,
  },
  nextBtn: {
    backgroundColor: FairytaleTheme.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  endBlock: {
    alignItems: 'center',
    gap: 8,
  },
  endTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: FairytaleTheme.text,
  },
  endSub: {
    fontSize: 15,
    color: FairytaleTheme.textMuted,
    marginBottom: 12,
  },
});
