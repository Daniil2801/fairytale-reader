import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";

export async function saveToken(token: string) {
  if (Platform.OS === "web") {
    return AsyncStorage.setItem(TOKEN_KEY, token);
  }

  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  if (Platform.OS === "web") {
    return AsyncStorage.getItem(TOKEN_KEY);
  }

  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken() {
  if (Platform.OS === "web") {
    return AsyncStorage.removeItem(TOKEN_KEY);
  }

  return SecureStore.deleteItemAsync(TOKEN_KEY);
}