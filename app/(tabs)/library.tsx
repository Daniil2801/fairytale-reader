import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionHeader } from '@/components/SectionHeader';
import { StoryCard } from '@/components/StoryCard';
import { FairytaleTheme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import {
  getPremiumStories,
  getReleasedStories,
  getUpcomingStories,
} from '@/services/storyService';
import type { Story } from '@/types/story';

export default function LibraryScreen() {
  const router = useRouter();
  const { localizedStories, checkAccess, ui } = useApp();

  const released = getReleasedStories(localizedStories);
  const premium = getPremiumStories(localizedStories);
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
      <ScrollView contentContainerStyle={styles.scroll}>
        <SectionHeader
          title={ui('library.title')}
          subtitle={`${released.length} ${ui('library.sub')} · ${upcoming.length}`}
        />

        {released.map((story) => {
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

        {premium.length > 0 && (
          <View style={styles.spacer}>
            <SectionHeader title={ui('library.premium')} subtitle="" />
          </View>
        )}

        {upcoming.length > 0 && (
          <>
            <SectionHeader title={ui('library.scheduled')} />
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
  spacer: {
    marginTop: 8,
  },
});
