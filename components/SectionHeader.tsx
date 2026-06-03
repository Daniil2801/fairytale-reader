import { StyleSheet, Text, View } from 'react-native';

import { FairytaleTheme } from '@/constants/Theme';

type Props = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: FairytaleTheme.text,
  },
  subtitle: {
    fontSize: 14,
    color: FairytaleTheme.textMuted,
    marginTop: 4,
  },
});
