import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { FairytaleTheme } from '@/constants/Theme';

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📖✨</Text>
      <Text style={styles.title}>Fairytale Dreams</Text>
      <ActivityIndicator size="large" color={FairytaleTheme.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FairytaleTheme.background,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: FairytaleTheme.text,
    marginBottom: 24,
  },
  spinner: {
    marginTop: 8,
  },
});
