import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { FairytaleTheme } from '@/constants/Theme';

type Props = {
  isSpeaking: boolean;
  autoPlay: boolean;
  onTogglePlay: () => void;
  onToggleAutoPlay: () => void;
  listenLabel: string;
  stopLabel: string;
  autoReadLabel: string;
  hint: string;
};

export function NarrationBar({
  isSpeaking,
  autoPlay,
  onTogglePlay,
  onToggleAutoPlay,
  listenLabel,
  stopLabel,
  autoReadLabel,
  hint,
}: Props) {
  return (
    <View style={styles.bar}>
      <Pressable
        style={[styles.playBtn, isSpeaking && styles.playBtnActive]}
        onPress={onTogglePlay}
        accessibilityLabel={isSpeaking ? 'Stop narration' : 'Play narration'}
        accessibilityRole="button">
        <SymbolView
          name={{
            ios: isSpeaking ? 'stop.fill' : 'play.fill',
            android: isSpeaking ? 'stop' : 'play_arrow',
            web: isSpeaking ? 'stop' : 'play_arrow',
          }}
          size={22}
          tintColor="#fff"
        />
        <Text style={styles.playLabel}>{isSpeaking ? stopLabel : listenLabel}</Text>
      </Pressable>

      <View style={styles.divider} />

      <Pressable
        style={[styles.autoBtn, autoPlay && styles.autoBtnActive]}
        onPress={onToggleAutoPlay}
        accessibilityLabel="Auto-read all pages"
        accessibilityRole="button">
        <SymbolView
          name={{
            ios: 'speaker.wave.3.fill',
            android: 'record_voice_over',
            web: 'record_voice_over',
          }}
          size={20}
          tintColor={autoPlay ? '#fff' : FairytaleTheme.primary}
        />
        <Text style={[styles.autoLabel, autoPlay && styles.autoLabelActive]}>
          {autoReadLabel}
        </Text>
      </Pressable>

      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: FairytaleTheme.surfaceAlt,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: FairytaleTheme.border,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: FairytaleTheme.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  playBtnActive: {
    backgroundColor: FairytaleTheme.accent,
  },
  playLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: FairytaleTheme.border,
  },
  autoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: FairytaleTheme.primary,
  },
  autoBtnActive: {
    backgroundColor: FairytaleTheme.primary,
    borderColor: FairytaleTheme.primary,
  },
  autoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: FairytaleTheme.primary,
  },
  autoLabelActive: {
    color: '#fff',
  },
  hint: {
    width: '100%',
    fontSize: 11,
    color: FairytaleTheme.textMuted,
    marginTop: 2,
  },
});
