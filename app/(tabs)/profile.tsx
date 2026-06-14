import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguagePicker } from '@/components/LanguagePicker';
import { getLanguageOption } from '@/constants/languages';
import { FairytaleTheme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import { formatWeekReset } from '@/lib/dates';

import { getProfile } from '@/src/api/user.api';
import type { UserProfile } from '@/types/user';

import { useEffect, useState } from 'react';
import {
  Alert,
  TextInput,
} from 'react-native';

import {
  login,
  register,
} from '@/src/api/auth.api';

import {
  getToken,
  removeToken,
  saveToken,
} from '@/src/services/authStorage';

import {
  getVoiceRate,
  saveVoiceRate,
} from "@/src/services/settingsStorage";

export default function ProfileScreen() {
  const {
    entitlements,
    readsRemaining,
    devSetPremium,
    textLanguage,
    voiceLanguage,
    voiceFollowsText,
    setTextLanguage,
    setVoiceLanguage,
    setVoiceFollowsText,
    ui,
  } = useApp();
  const isPremium = entitlements.tier === 'premium';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [voiceRate, setVoiceRate] =
    useState(1);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    loadVoiceSettings();
  }, []);

  async function loadVoiceSettings() {
    const rate =
      await getVoiceRate();

    setVoiceRate(rate);
  }

  async function checkAuth() {
    const token = await getToken();

    const authenticated = !!token;

    setIsAuthenticated(authenticated);

    if (authenticated) {
      await loadProfile();
    }
  }

  async function handleLogin() {
    try {
      const result = await login(
        email,
        password
      );

      await saveToken(result.token);

      setIsAuthenticated(true);

      await loadProfile();

      Alert.alert('Success', 'Logged in');
      // window.alert('Success');
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Error',
        'Login failed'
      );
    }
  }

  async function handleRegister() {
    try {
      const result = await register(
        email,
        password
      );

      await saveToken(result.token);

      setIsAuthenticated(true);

      await loadProfile();

      Alert.alert(
        'Success',
        'Account created'
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Error',
        'Registration failed'
      );
    }
  }

  async function loadProfile() {
    try {
      const data = await getProfile();

      setProfile(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogout() {
    await removeToken();

    setProfile(null);

    setIsAuthenticated(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{ui('profile.title')}</Text>

        <View style={styles.card}>
          {!isAuthenticated ? (
            <>
              <Text style={styles.sectionTitle}>
                Account
              </Text>

              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
              />

              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
              />

              <Pressable
                style={styles.primaryBtn}
                onPress={handleLogin}
              >
                <Text style={styles.primaryBtnText}>
                  Login
                </Text>
              </Pressable>

              <Pressable
                style={styles.secondaryBtn}
                onPress={handleRegister}
              >
                <Text style={styles.secondaryBtnText}>
                  Register
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>
                Logged in
              </Text>

              {profile && (
                <>
                  <Text style={styles.body}>
                    Email: {profile.email}
                  </Text>

                  <Text style={styles.body}>
                    Stories created:
                    {" "}
                    {profile._count.stories}
                  </Text>

                  <Text style={styles.body}>
                    Stories left:
                    {" "}
                    {profile.freeStoriesLeft}
                  </Text>

                  <Text style={styles.body}>
                    Plan:
                    {" "}
                    {profile.isPremium
                      ? "Premium"
                      : "Free"}
                  </Text>
                </>
              )}

              <Pressable
                style={styles.secondaryBtn}
                onPress={handleLogout}
              >
                <Text style={styles.secondaryBtnText}>
                  Logout
                </Text>
              </Pressable>
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>{ui('profile.plan')}</Text>
          <Text style={styles.cardValue}>
            {isPremium ? ui('profile.premium') : ui('profile.free')}
          </Text>
          {!isPremium && (
            <Text style={styles.cardHint}>
              {readsRemaining} {ui('profile.readsLeft')}{' '}
              {formatWeekReset(entitlements.weekStartedAt)}
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{ui('profile.langTitle')}</Text>
          <Text style={styles.body}>{ui('profile.langSub')}</Text>

          <LanguagePicker
            label={ui('profile.storyLanguage')}
            selected={textLanguage}
            onSelect={(code) => void setTextLanguage(code)}
          />

          <View style={styles.followRow}>
            <Text style={styles.followLabel}>{ui('profile.voiceSameAsStory')}</Text>
            <Switch
              value={voiceFollowsText}
              onValueChange={(v) => void setVoiceFollowsText(v)}
              trackColor={{ true: FairytaleTheme.primary, false: '#ccc' }}
            />
          </View>

          {!voiceFollowsText && (
            <LanguagePicker
              label={ui('profile.voiceLanguage')}
              hint={getLanguageOption(voiceLanguage).englishLabel}
              selected={voiceLanguage}
              onSelect={(code) => void setVoiceLanguage(code)}
            />
          )}

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                Voice Speed
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 12,
                }}
            >
              {[0.75, 1, 1.25, 1.5].map(
                rate => (
                  <Pressable
                    key={rate}
                    onPress={async () => {
                      setVoiceRate(rate);

                      await saveVoiceRate(
                        rate
                      );
                    }}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor:
                        voiceRate === rate
                          ? "#6B5AE0"
                          : "#ddd",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          voiceRate === rate
                            ? "white"
                            : "black",
                      }}
                    >
                      {rate}x
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </View>
        </View>

        {!isPremium && (
          <Link href="/subscribe" asChild>
            <Pressable style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>{ui('profile.upgrade')}</Text>
            </Pressable>
          </Link>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{ui('profile.aboutTitle')}</Text>
          <Text style={styles.body}>{ui('profile.aboutBody')}</Text>
        </View>

        <View style={styles.devCard}>
          <Text style={styles.devTitle}>Developer preview</Text>
          <Text style={styles.devHint}>Simulate subscription (remove before release)</Text>
          <View style={styles.devRow}>
            <Text style={styles.devLabel}>Premium access</Text>
            <Switch
              value={isPremium}
              onValueChange={(v) => devSetPremium(v)}
              trackColor={{ true: FairytaleTheme.primary, false: '#ccc' }}
            />
          </View>
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: FairytaleTheme.text,
    marginBottom: 20,
  },
  card: {
    backgroundColor: FairytaleTheme.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: FairytaleTheme.border,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: FairytaleTheme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: FairytaleTheme.text,
    marginTop: 4,
  },
  cardHint: {
    fontSize: 14,
    color: FairytaleTheme.textMuted,
    marginTop: 8,
  },
  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  followLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: FairytaleTheme.text,
    flex: 1,
    marginRight: 12,
  },
  primaryBtn: {
    backgroundColor: FairytaleTheme.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: FairytaleTheme.text,
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: FairytaleTheme.textMuted,
    marginBottom: 12,
  },
  devCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  devTitle: {
    fontWeight: '700',
    color: '#E65100',
  },
  devHint: {
    fontSize: 12,
    color: '#BF360C',
    marginTop: 4,
    marginBottom: 12,
  },
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  devLabel: {
    fontSize: 15,
    color: FairytaleTheme.text,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: FairytaleTheme.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: FairytaleTheme.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },

  secondaryBtnText: {
    color: FairytaleTheme.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
