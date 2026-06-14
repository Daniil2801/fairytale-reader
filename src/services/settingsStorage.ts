import AsyncStorage from "@react-native-async-storage/async-storage";

const VOICE_RATE_KEY =
  "voice_rate";

export async function saveVoiceRate(
  rate: number
) {
  await AsyncStorage.setItem(
    VOICE_RATE_KEY,
    String(rate)
  );
}

export async function getVoiceRate() {
  const value =
    await AsyncStorage.getItem(
      VOICE_RATE_KEY
    );

  return value
    ? Number(value)
    : 1;
}