import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { generateStory } from "@/src/api/story.api";
import { router } from "expo-router";

export default function CreateScreen() {
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("6");
  const [theme, setTheme] = useState("");
  const [favoriteAnimal, setFavoriteAnimal] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleGenerate() {
    try {
      setLoading(true);

      const story = await generateStory({
        childName,
        age: Number(age),
        theme,
        favoriteAnimal,
      });

      console.log(story);

      router.push({
        pathname: "../generated/[id]",
        params: {
          id: story.id
        }
      });
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Error",
        "Generation failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>
          Create a Story
        </Text>

        <TextInput
          placeholder="Child Name"
          value={childName}
          onChangeText={setChildName}
          style={styles.input}
        />

        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Theme"
          value={theme}
          onChangeText={setTheme}
          style={styles.input}
        />

        <TextInput
          placeholder="Favorite Animal"
          value={favoriteAnimal}
          onChangeText={setFavoriteAnimal}
          style={styles.input}
        />

        <Pressable
          style={styles.button}
          onPress={handleGenerate}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Generating..."
              : "Generate Story"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  button: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#6B5AE0",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});