import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
} from "react-native";

import {
  speak,
  stopNarration
} from "@/services/narrationService";

import { getGeneratedStory } from "@/src/api/generatedStories.api";

import {
  deleteStory,
} from "@/src/api/story.api";
import { getVoiceRate } from "@/src/services/settingsStorage";
import type { GeneratedStory } from "@/types/generatedStory";

export default function GeneratedStory() {
  const { id } =
    useLocalSearchParams();

  const router = useRouter();

  const [story, setStory] =
    useState<GeneratedStory | null>(null);

  useEffect(() => {
    load();
  }, []);

  const [deleting, setDeleting] =
    useState(false);

  const [narrating, setNarrating] =
    useState(false);

  async function load() {
    const result =
      await getGeneratedStory(
        String(id)
      );

    setStory(result);
  }

  if (!story) {
    return <Text>Loading...</Text>;
  }

  async function handleNarrate() {
    if (!story) {
      return;
    }

    const rate =
      await getVoiceRate();

    speak(story.content, {
      rate,
      onStart: () => {
        setNarrating(true);
      },

      onDone: () => {
        setNarrating(false);
      },

      onStopped: () => {
        setNarrating(false);
      },

      onError: () => {
        setNarrating(false);
      },
    });
  }

  async function handleStop() {
    await stopNarration();

    setNarrating(false);
  }

  async function performDelete() {
    if (!story) {
      return;
    }

    try {
      setDeleting(true);

      await stopNarration();

      await deleteStory(story.id);

      router.replace("/(tabs)/library");
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Error",
        "Failed to delete story"
      );
    } finally {
      setDeleting(false);
    }
  }

  function handleDelete() {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Delete this story?"
      );

      if (confirmed) {
        void performDelete();
      }

      return;
    }

    Alert.alert(
      "Delete Story",
      "Are you sure you want to delete this story?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void performDelete();
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 24,
        }}
      >
        {story.title}
      </Text>

      {story.imageUrl && (
        <Image
        source={{
            uri: story.imageUrl,
        }}
        style={{
            width: '100%',
            height: 300,
            borderRadius: 20,
            marginBottom: 20,
        }}
      />
      )}

      <Pressable
        onPress={handleNarrate}
        style={{
          padding: 14,
          borderRadius: 12,
          backgroundColor: "#6B5AE0",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "700",
          }}
        >
          🔊 Read Aloud
        </Text>
      </Pressable>

      {narrating && (
        <Pressable
          onPress={handleStop}
          style={{
            padding: 14,
            borderRadius: 12,
            backgroundColor: "#d9534f",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            Stop
          </Text>
        </Pressable>
      )}

      <Pressable
        disabled={deleting}
        onPress={handleDelete}
        style={{
          padding: 14,
          borderRadius: 12,
          backgroundColor: "#d9534f",
          marginBottom: 20,
          opacity: deleting ? 0.6 : 1,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "700",
          }}
        >
          {deleting
            ? "Deleting..."
            : "🗑 Delete Story"}
        </Text>
      </Pressable>

      <Text
        style={{
          fontSize: 18,
          lineHeight: 32,
        }}
      >
        {story.content}
      </Text>
    </ScrollView>
  );
}