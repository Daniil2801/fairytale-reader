import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PAYMENT_METHODS } from '@/constants/payments';
import { FairytaleTheme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import type { PaymentMethod } from '@/types/payment';

type Props = {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
};

export function PaymentMethodPicker({ selected, onSelect }: Props) {
  const { ui } = useApp();

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{ui('payment.chooseMethod')}</Text>
      {PAYMENT_METHODS.map((m) => {
        const active = selected === m.id;
        return (
          <Pressable
            key={m.id}
            onPress={() => onSelect(m.id)}
            style={[styles.card, active && styles.cardActive]}>
            <Text style={styles.icon}>{m.icon}</Text>
            <View style={styles.text}>
              <Text style={[styles.name, active && styles.nameActive]}>
                {ui(m.titleKey)}
              </Text>
              <Text style={styles.desc}>{ui(m.descKey)}</Text>
            </View>
            <View style={[styles.radio, active && styles.radioActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: FairytaleTheme.text,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: FairytaleTheme.border,
    backgroundColor: FairytaleTheme.surface,
    marginBottom: 10,
    gap: 12,
  },
  cardActive: {
    borderColor: FairytaleTheme.primary,
    backgroundColor: FairytaleTheme.surfaceAlt,
  },
  icon: {
    fontSize: 28,
  },
  text: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: FairytaleTheme.text,
  },
  nameActive: {
    color: FairytaleTheme.primary,
  },
  desc: {
    fontSize: 12,
    color: FairytaleTheme.textMuted,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: FairytaleTheme.border,
  },
  radioActive: {
    borderColor: FairytaleTheme.primary,
    backgroundColor: FairytaleTheme.primary,
  },
});
