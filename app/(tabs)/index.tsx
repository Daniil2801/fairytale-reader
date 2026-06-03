import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { QuotaBanner } from '@/components/QuotaBanner';
import { SectionHeader } from '@/components/SectionHeader';
import { StoryCard } from '@/components/StoryCard';
import { FairytaleTheme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import {
  getFreeStoriesThisWeek,
  getReleasedStories,
  getUpcomingStories,
} from '@/services/storyService';
import type { Story } from '@/types/story';

export default function HomeScreen() {
  const router = useRouter();
  const { localizedStories, checkAccess, refreshing, refresh, ui } = useApp();

  const released = getReleasedStories(localizedStories);
  const freePicks = getFreeStoriesThisWeek(localizedStories).slice(0, 4);
  const upcoming = getUpcomingStories(localizedStories);

  const handlePress = (story: Story) => {
    const access = checkAccess(story);
    if (!access.allowed) {
      router.push({
        pathname: '/subscribe',
        params: { reason: access.reason, storyId: story.id },
      });
      return;
    }
    router.push(`/story/${story.id}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={FairytaleTheme.primary} />
        }>
        <LinearGradient
          colors={[FairytaleTheme.gradientStart, FairytaleTheme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.hero}>
          <Text style={styles.heroEmoji}>🌙📚</Text>
          <Text style={styles.heroTitle}>{ui('home.heroTitle')}</Text>
          <Text style={styles.heroSub}>{ui('home.heroSub')}</Text>
        </LinearGradient>

        <QuotaBanner />

        <SectionHeader title={ui('home.freeTales')} subtitle={ui('home.freeTalesSub')} />
        {freePicks.map((story) => {
          const access = checkAccess(story);
          return (
            <StoryCard
              key={story.id}
              story={story}
              locked={!access.allowed}
              lockReason={access.reason}
              onPress={() => handlePress(story)}
            />
          );
        })}

        {released.length > freePicks.length && (
          <>
            <SectionHeader title={ui('home.moreLibrary')} subtitle="" />
            {released
              .filter((s) => !freePicks.find((f) => f.id === s.id))
              .slice(0, 3)
              .map((story) => {
                const access = checkAccess(story);
                return (
                  <StoryCard
                    key={story.id}
                    story={story}
                    locked={!access.allowed}
                    lockReason={access.reason}
                    onPress={() => handlePress(story)}
                  />
                );
              })}
          </>
        )}

        {upcoming.length > 0 && (
          <>
            <SectionHeader title={ui('home.comingSoon')} subtitle="" />
            {upcoming.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                locked
                lockReason="not_released"
                onPress={() => handlePress(story)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: FairytaleTheme.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  hero: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  heroEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  heroSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 8,
    lineHeight: 22,
  },
});
