import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { FREE_STORIES_PER_WEEK } from '@/constants/config';
import { FairytaleTheme } from '@/constants/Theme';
import { formatWeekReset } from '@/lib/dates';
import { useApp } from '@/context/AppContext';

export function QuotaBanner() {
  const { entitlements, readsRemaining, readsUsed, ui } = useApp();

  if (entitlements.tier === 'premium') {
    return (
      <LinearGradient
        colors={[FairytaleTheme.gradientStart, FairytaleTheme.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.premiumBanner}>
        <Text style={styles.premiumTitle}>{ui('quota.premiumTitle')}</Text>
        <Text style={styles.premiumSub}>{ui('quota.premiumSub')}</Text>
      </LinearGradient>
    );
  }

  const exhausted = readsRemaining === 0;

  return (
    <View style={[styles.banner, exhausted && styles.bannerWarn]}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>
          {exhausted
            ? ui('quota.exhausted')
            : `${readsRemaining} / ${FREE_STORIES_PER_WEEK} ${ui('quota.remaining')}`}
        </Text>
        <Text style={styles.sub}>
          Resets {formatWeekReset(entitlements.weekStartedAt)} · {readsUsed} read
        </Text>
      </View>
      <Link href="/subscribe" asChild>
        <Pressable style={styles.cta}>
          <Text style={styles.ctaText}>{ui('quota.upgrade')}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FairytaleTheme.surfaceAlt,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: FairytaleTheme.border,
    gap: 12,
  },
  bannerWarn: {
    borderColor: FairytaleTheme.accent,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: FairytaleTheme.text,
  },
  sub: {
    fontSize: 12,
    color: FairytaleTheme.textMuted,
    marginTop: 4,
  },
  cta: {
    backgroundColor: FairytaleTheme.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  premiumBanner: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  premiumTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
  },
  premiumSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
});
