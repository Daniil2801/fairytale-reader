import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FairytaleTheme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import type { CryptoChainId, CryptoChainOption } from '@/types/payment';

type Props = {
  chains: CryptoChainOption[];
  selected: CryptoChainId;
  onSelect: (chainId: CryptoChainId) => void;
};

export function CryptoChainPicker({ chains, selected, onSelect }: Props) {
  const { ui } = useApp();

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{ui('payment.crypto.pickChain')}</Text>
      <View style={styles.row}>
        {chains.map((chain) => {
          const active = chain.id === selected;
          return (
            <Pressable
              key={chain.id}
              onPress={() => onSelect(chain.id)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={styles.chipIcon}>{chain.icon}</Text>
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                {chain.label}
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
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: FairytaleTheme.textMuted,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: FairytaleTheme.border,
    backgroundColor: FairytaleTheme.surface,
  },
  chipActive: {
    borderColor: FairytaleTheme.primary,
    backgroundColor: FairytaleTheme.surfaceAlt,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: FairytaleTheme.text,
  },
  chipLabelActive: {
    color: FairytaleTheme.primary,
  },
});
