import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguagePicker } from '@/components/LanguagePicker';
import { getLanguageOption } from '@/constants/languages';
import { FairytaleTheme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import { formatWeekReset } from '@/lib/dates';

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

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{ui('profile.title')}</Text>

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
});
