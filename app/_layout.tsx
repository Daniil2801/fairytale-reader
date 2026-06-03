import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { LoadingScreen } from '@/components/LoadingScreen';
import { AppProvider } from '@/context/AppContext';
import { FairytaleTheme } from '@/constants/Theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppProvider onReady={() => setAppReady(true)}>
        {appReady ? <RootStack /> : <LoadingScreen />}
      </AppProvider>
    </>
  );
}

function RootStack() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: FairytaleTheme.background },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="story/[id]"
        options={{ headerShown: false, presentation: 'card' }}
      />
      <Stack.Screen
        name="subscribe"
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen
        name="payment/[id]"
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
