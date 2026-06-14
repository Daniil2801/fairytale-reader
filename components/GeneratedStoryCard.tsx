import { Pressable, StyleSheet, Text, View } from "react-native";

import type { GeneratedStory } from "@/types/generatedStory";

interface Props {
  story: GeneratedStory;
  onPress: () => void;
  onFavorite: () => void;
}

export function GeneratedStoryCard({
  story,
  onPress,
  onFavorite,
}: Props) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <Text style={styles.title}>
        {story.title}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>
          {story.title}
        </Text>

        <Pressable
          onPress={onFavorite}
        >
          <Text
            style={{
              fontSize: 24,
            }}
          >
            {story.isFavorite
              ? "❤️"
              : "🤍"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.meta}>
        {story.theme}
      </Text>

      <Text style={styles.meta}>
        Age: {story.age}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  meta: {
    marginTop: 4,
    opacity: 0.7,
  },
});