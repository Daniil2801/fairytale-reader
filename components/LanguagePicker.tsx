import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SUPPORTED_LANGUAGES } from '@/constants/languages';
import { FairytaleTheme } from '@/constants/Theme';
import type { AppLanguage } from '@/types/language';

type Props = {
  label: string;
  hint?: string;
  selected: AppLanguage;
  onSelect: (code: AppLanguage) => void;
  compact?: boolean;
};

export function LanguagePicker({
  label,
  hint,
  selected,
  onSelect,
  compact,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={[styles.row, compact && styles.rowCompact]}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const active = lang.code === selected;
          return (
            <Pressable
              key={lang.code}
              onPress={() => onSelect(lang.code)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {lang.nativeLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: FairytaleTheme.text,
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: FairytaleTheme.textMuted,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rowCompact: {
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: FairytaleTheme.border,
    backgroundColor: FairytaleTheme.surface,
  },
  chipActive: {
    backgroundColor: FairytaleTheme.primary,
    borderColor: FairytaleTheme.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: FairytaleTheme.text,
  },
  chipTextActive: {
    color: '#fff',
  },
});
