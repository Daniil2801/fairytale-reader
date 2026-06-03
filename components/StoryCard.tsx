import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { FairytaleTheme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import { isWithinDays } from '@/lib/dates';
import type { AccessReason } from '@/services/entitlementService';
import type { Story } from '@/types/story';

type Props = {
  story: Story;
  locked?: boolean;
  lockReason?: AccessReason;
  onPress: () => void;
};

const lockLabels: Record<AccessReason, string> = {
  allowed: '',
  premium_required: 'Premium',
  weekly_limit: 'Weekly limit',
  not_released: 'Coming soon',
};

export function StoryCard({ story, locked, lockReason, onPress }: Props) {
  const { ui } = useApp();
  const isNew = isWithinDays(story.createdAt, 7);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        locked && styles.cardLocked,
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.emojiWrap}>
        <Text style={styles.emoji}>{story.coverEmoji}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {story.title}
          </Text>
          {isNew && !locked && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{ui('card.new')}</Text>
            </View>
          )}
        </View>
        <Text style={styles.summary} numberOfLines={2}>
          {story.summary}
        </Text>
        <Text style={styles.meta}>
          Ages {story.ageMin}–{story.ageMax} · {story.readingMinutes} min · 🔊 {ui('card.illustrated')}
        </Text>
      </View>
      {locked && lockReason && (
        <View style={styles.lock}>
          <SymbolView
            name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
            size={18}
            tintColor={FairytaleTheme.locked}
          />
          <Text style={styles.lockText}>{lockLabels[lockReason]}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FairytaleTheme.surface,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FairytaleTheme.border,
    gap: 12,
  },
  cardLocked: {
    opacity: 0.85,
    backgroundColor: FairytaleTheme.surfaceAlt,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  emojiWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: FairytaleTheme.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: FairytaleTheme.text,
  },
  badge: {
    backgroundColor: FairytaleTheme.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  summary: {
    fontSize: 14,
    color: FairytaleTheme.textMuted,
    marginTop: 4,
    lineHeight: 20,
  },
  meta: {
    fontSize: 12,
    color: FairytaleTheme.textMuted,
    marginTop: 6,
  },
  lock: {
    alignItems: 'center',
    gap: 4,
    minWidth: 52,
  },
  lockText: {
    fontSize: 10,
    fontWeight: '600',
    color: FairytaleTheme.locked,
    textAlign: 'center',
  },
});
