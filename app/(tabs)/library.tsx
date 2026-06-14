import { useFocusEffect, useRouter } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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

import { getMyStories, toggleFavorite } from '@/src/api/story.api';
import { useCallback, useState } from 'react';

import { GeneratedStoryCard } from '@/components/GeneratedStoryCard';
import type { GeneratedStory } from '@/types/generatedStory';

export default function LibraryScreen() {
  const router = useRouter();
  const { localizedStories, checkAccess, ui } = useApp();

  const released = getReleasedStories(localizedStories);
  const premium = getPremiumStories(localizedStories);
  const upcoming = getUpcomingStories(localizedStories);

  const [stories, setStories] = useState<GeneratedStory[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadStories();
    }, [])
  );

  const [favoritesOnly, setFavoritesOnly] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  const [sortBy, setSortBy] =
    useState<
      "newest" |
      "oldest" |
      "alphabet" |
      "favorites"
    >("newest");

  const filteredStories = stories
    .filter(story =>
      favoritesOnly
        ? story.isFavorite
        : true
    )
    .filter(story =>
      story.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      story.theme
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      story.childName
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const sortedStories =
    [...filteredStories].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );

        case "alphabet":
          return a.title.localeCompare(
            b.title
          );

        case "favorites":
          return Number(
            b.isFavorite
          ) - Number(
            a.isFavorite
          );

        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
      }
    });

  async function loadStories() {
    try {
      const result = await getMyStories();

      setStories(result);
    } catch (error) {
      console.error(
        "Failed to load stories",
        error
      );
    }
  }

  async function handleFavorite(
    storyId: string
  ) {
    try {
      const updated =
        await toggleFavorite(storyId);

      setStories(prev =>
        prev.map(story =>
          story.id === storyId
            ? updated
            : story
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  const handleGeneratedStoryPress = (id: string) => {
    router.push({
      pathname: "/generated/[id]",
      params: { id },
    });
  };

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

  async function onRefresh() {
    try {
      setRefreshing(true);

      await loadStories();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> } contentContainerStyle={styles.scroll}>
        <SectionHeader
          title={ui('library.title')}
          subtitle={`${released.length} ${ui('library.sub')} · ${upcoming.length}`}
        />

        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
            gap: 8,
          }}
        >
          <Pressable
            onPress={() =>
              setFavoritesOnly(false)
            }
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor:
                !favoritesOnly
                  ? "#6B5AE0"
                  : "#ddd",
            }}
          >
            <Text>
              All
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              setFavoritesOnly(true)
            }
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor:
                favoritesOnly
                  ? "#6B5AE0"
                  : "#ddd",
            }}
          >
            <Text>
              Favorites ❤️
            </Text>
          </Pressable>
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search stories..."
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
          }}
        />

        {stories.length > 0 && (
          <>
            <SectionHeader
              title="My AI Stories"
              subtitle={`${stories.length} stories`}
            />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 16,
              }}
              >
              <Pressable
                onPress={() =>
                  setSortBy("newest")
                }
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor:
                      sortBy === "newest"
                        ? "#6B5AE0"
                        : "#ddd",
                  }}
              >
                <Text
                  style={{
                    color:
                      sortBy === "newest"
                        ? "white"
                        : "black",
                  }}
                >
                  Newest
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  setSortBy("oldest")
                }
                style={{
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor:
                    sortBy === "oldest"
                      ? "#6B5AE0"
                      : "#ddd",
                }}
              >
                <Text
                  style={{
                    color:
                      sortBy === "oldest"
                        ? "white"
                        : "black",
                  }}
                >
                  Oldest
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  setSortBy("alphabet")
                }
                style={{
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor:
                    sortBy === "alphabet"
                      ? "#6B5AE0"
                      : "#ddd",
                }}
              >
                <Text
                  style={{
                    color:
                      sortBy === "alphabet"
                        ? "white"
                        : "black",
                  }}
                >
                  A-Z
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  setSortBy("favorites")
                }
                style={{
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor:
                    sortBy === "favorites"
                      ? "#6B5AE0"
                      : "#ddd",
                }}
              >
                <Text
                  style={{
                    color:
                      sortBy === "favorites"
                        ? "white"
                        : "black",
                  }}
                >
                  ❤️ First
                </Text>
              </Pressable>
            </View>

            {sortedStories.map((story) => (
              <GeneratedStoryCard
              key={story.id}
              story={story}
              onPress={() =>
                handleGeneratedStoryPress(
                  story.id
                )
              }
              onFavorite={() =>
                handleFavorite(
                  story.id
                )
              }
            />
            ))}
          </>
        )}

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
