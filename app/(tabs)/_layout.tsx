import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { FairytaleTheme } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: FairytaleTheme.primary,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: FairytaleTheme.surface,
          borderTopColor: FairytaleTheme.border,
        },
        headerStyle: {
          backgroundColor: FairytaleTheme.background,
        },
        headerTintColor: FairytaleTheme.text,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'house.fill', android: 'home', web: 'home' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'books.vertical.fill', android: 'menu_book', web: 'menu_book' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Family',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}
