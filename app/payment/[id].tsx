import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CryptoChainPicker } from '@/components/CryptoChainPicker';
import { PLAN_STARS } from '@/constants/payments';
import { FairytaleTheme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import { activatePremiumFromPayment } from '@/services/entitlementService';
import {
  getPaymentStatus,
  loadPaymentSession,
  openTelegramInvoice,
  selectCryptoChain,
  simulatePaymentComplete,
} from '@/services/paymentService';
import type { CreatePaymentResponse, CryptoChainId } from '@/types/payment';

export default function PaymentStatusScreen() {
  const { id, planId } = useLocalSearchParams<{ id: string; planId?: string }>();
  const router = useRouter();
  const { ui, refresh } = useApp();
  const [created, setCreated] = useState<CreatePaymentResponse | null>(null);
  const [status, setStatus] = useState<string>('pending');
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'memo' | 'address' | null>(null);
  const [selectedChain, setSelectedChain] = useState<CryptoChainId>('trc20');

  const poll = useCallback(async () => {
    if (!id) return;
    try {
      const res = await getPaymentStatus(id);
      setStatus(res.payment.status);
      if (res.payment.selectedCryptoChain) {
        setSelectedChain(res.payment.selectedCryptoChain);
      }
      if (res.premiumActivated || res.payment.status === 'completed') {
        await activatePremiumFromPayment(id);
        await refresh();
        router.replace('/(tabs)');
        return;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  }, [id, refresh, router]);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const session = await loadPaymentSession(id);
      if (session) {
        setCreated(session);
        if (session.crypto?.defaultChainId) {
          setSelectedChain(session.crypto.defaultChainId);
        }
      }
      try {
        const res = await getPaymentStatus(id);
        setStatus(res.payment.status);
        if (res.payment.selectedCryptoChain) {
          setSelectedChain(res.payment.selectedCryptoChain);
        }
        if (res.premiumActivated) {
          router.replace('/(tabs)');
        }
      } catch {
        /* optional */
      }
    })();
  }, [id, router]);

  useEffect(() => {
    if (!id || status === 'completed') return;
    const t = setInterval(() => void poll(), 3000);
    return () => clearInterval(t);
  }, [id, poll, status]);

  const crypto = created?.crypto;
  const chains = crypto?.chains ?? [];
  const activeChain = useMemo(
    () => chains.find((c) => c.id === selectedChain) ?? chains[0],
    [chains, selectedChain],
  );

  const telegram = created?.telegram;
  const stars =
    planId && planId in PLAN_STARS
      ? PLAN_STARS[planId as keyof typeof PLAN_STARS]
      : telegram?.stars;

  const copyText = async (text: string, field: 'memo' | 'address') => {
    await Clipboard.setStringAsync(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleChainSelect = async (chainId: CryptoChainId) => {
    setSelectedChain(chainId);
    if (id) {
      try {
        await selectCryptoChain(id, chainId);
      } catch {
        /* non-blocking */
      }
    }
  };

  const handleSimulate = async () => {
    if (!id) return;
    await simulatePaymentComplete(id);
    await poll();
  };

  const handleOpenTelegram = async () => {
    if (telegram?.invoiceUrl) {
      await openTelegramInvoice(telegram.invoiceUrl);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>{ui('reader.back')}</Text>
        </Pressable>

        <Text style={styles.title}>{ui('payment.pending')}</Text>
        <Text style={styles.sub}>{ui('payment.poll')}</Text>

        {crypto && chains.length > 0 && activeChain && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{ui('payment.crypto.title')}</Text>

            <CryptoChainPicker
              chains={chains}
              selected={selectedChain}
              onSelect={handleChainSelect}
            />

            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>{ui('payment.crypto.send')}</Text>
              <Text style={styles.amountValue}>
                {activeChain.amount} {activeChain.currency}
              </Text>
              <Text style={styles.networkHint}>
                {activeChain.label} · {activeChain.network}
              </Text>
              {activeChain.altAmount ? (
                <Text style={styles.altAmount}>≈ {activeChain.altAmount}</Text>
              ) : null}
            </View>

            <Text style={styles.label}>{ui('payment.crypto.address')}</Text>
            <Pressable onPress={() => copyText(activeChain.address, 'address')}>
              <Text style={styles.mono} selectable>
                {activeChain.address}
              </Text>
              <Text style={styles.copyHint}>
                {copiedField === 'address'
                  ? ui('payment.crypto.copied')
                  : ui('payment.crypto.copyAddress')}
              </Text>
            </Pressable>

            <Text style={styles.label}>{ui('payment.crypto.memo')}</Text>
            <Pressable onPress={() => copyText(crypto.memo, 'memo')}>
              <Text style={styles.mono} selectable>
                {crypto.memo}
              </Text>
              <Text style={styles.copyHint}>
                {copiedField === 'memo'
                  ? ui('payment.crypto.copied')
                  : ui('payment.crypto.copy')}
              </Text>
            </Pressable>

            <Text style={styles.wait}>{ui('payment.crypto.waiting')}</Text>
            <Text style={styles.chainNote}>{ui('payment.crypto.chainNote')}</Text>
          </View>
        )}

        {(telegram || stars) && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{ui('payment.method.telegram')}</Text>
            {stars ? (
              <Text style={styles.row}>
                ⭐ {stars} {ui('payment.method.telegram')}
              </Text>
            ) : null}
            <Text style={styles.hint}>{ui('payment.telegram.hint')}</Text>
            <Pressable style={styles.primaryBtn} onPress={handleOpenTelegram}>
              <Text style={styles.primaryBtnText}>{ui('payment.telegram.open')}</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.statusRow}>
          <ActivityIndicator color={FairytaleTheme.primary} />
          <Text style={styles.statusText}>{status}</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {__DEV__ && (
          <Pressable style={styles.devBtn} onPress={handleSimulate}>
            <Text style={styles.devBtnText}>{ui('payment.devSimulate')}</Text>
          </Pressable>
        )}
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
  back: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: FairytaleTheme.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: FairytaleTheme.text,
  },
  sub: {
    fontSize: 14,
    color: FairytaleTheme.textMuted,
    marginTop: 8,
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
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: FairytaleTheme.text,
    marginBottom: 4,
  },
  amountBox: {
    backgroundColor: FairytaleTheme.surfaceAlt,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 12,
    color: FairytaleTheme.textMuted,
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '800',
    color: FairytaleTheme.primary,
    marginTop: 4,
  },
  networkHint: {
    fontSize: 13,
    color: FairytaleTheme.textMuted,
    marginTop: 4,
  },
  altAmount: {
    fontSize: 12,
    color: FairytaleTheme.textMuted,
    marginTop: 6,
  },
  row: {
    fontSize: 16,
    color: FairytaleTheme.text,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: FairytaleTheme.textMuted,
    marginTop: 8,
  },
  mono: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: FairytaleTheme.primaryDark,
    marginTop: 4,
    lineHeight: 20,
  },
  copyHint: {
    fontSize: 12,
    color: FairytaleTheme.primary,
    marginTop: 6,
    fontWeight: '600',
  },
  wait: {
    marginTop: 16,
    fontSize: 14,
    color: FairytaleTheme.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  chainNote: {
    fontSize: 11,
    color: FairytaleTheme.textMuted,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  hint: {
    fontSize: 14,
    color: FairytaleTheme.textMuted,
    lineHeight: 20,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: FairytaleTheme.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    color: FairytaleTheme.textMuted,
    textTransform: 'capitalize',
  },
  error: {
    color: '#c62828',
    textAlign: 'center',
    marginTop: 12,
  },
  devBtn: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    alignItems: 'center',
  },
  devBtnText: {
    color: '#E65100',
    fontWeight: '600',
  },
});
