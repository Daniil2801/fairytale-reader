import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { PaymentMethodPicker } from '@/components/PaymentMethodPicker';
import { FREE_STORIES_PER_WEEK, SUBSCRIPTION_PRICES } from '@/constants/config';
import { PLAN_STARS } from '@/constants/payments';
import { FairytaleTheme } from '@/constants/Theme';
import { useApp } from '@/context/AppContext';
import {
  createPayment,
  openCardCheckout,
  savePaymentSession,
} from '@/services/paymentService';
import { subscriptionService } from '@/services/subscriptionService';
import type { PlanId } from '@/services/subscriptionService';
import type { PaymentMethod } from '@/types/payment';

const REASON_COPY: Record<string, { title: string; body: string }> = {
  premium_required: {
    title: 'This tale is for Premium families',
    body: 'Unlock the full library of AI fairy tales, including new drops every week.',
  },
  weekly_limit: {
    title: "You've used your free stories this week",
    body: `Free plans include ${FREE_STORIES_PER_WEEK} stories per week. Upgrade for unlimited bedtime magic.`,
  },
  not_released: {
    title: "This story isn't ready yet",
    body: 'Premium members get early access as new stories are published.',
  },
};

export default function SubscribeScreen() {
  const router = useRouter();
  const { reason } = useLocalSearchParams<{ reason?: string; storyId?: string }>();
  const { restorePurchases, refresh, ui } = useApp();
  const [plan, setPlan] = useState<PlanId>('yearly');
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const copy = REASON_COPY[reason ?? ''] ?? {
    title: 'Fairytale Dreams Premium',
    body: 'Unlimited kid-safe AI stories, new tales added regularly, no ads.',
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const created = await createPayment(plan, method);
      const paymentId = created.payment.paymentId;
      await savePaymentSession(paymentId, created);

      if (method === 'card' && created.card?.checkoutUrl) {
        await openCardCheckout(created.card.checkoutUrl);
        await subscriptionService.completePayment(paymentId);
        await refresh();
        router.back();
        return;
      }

      if (method === 'crypto' || method === 'telegram_stars') {
        router.push({
          pathname: '/payment/[id]',
          params: { id: paymentId, planId: plan },
        });
        return;
      }
    } catch (e) {
      Alert.alert(
        ui('payment.failed'),
        e instanceof Error ? e.message : 'Unknown error',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await restorePurchases();
    } finally {
      setRestoring(false);
    }
  };

  const starsLabel =
    method === 'telegram_stars'
      ? ` · ⭐ ${PLAN_STARS[plan]}`
      : '';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.close}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <LinearGradient
          colors={[FairytaleTheme.gradientStart, FairytaleTheme.gradientEnd]}
          style={styles.hero}>
          <Text style={styles.heroEmoji}>✨🦄</Text>
          <Text style={styles.heroTitle}>{copy.title}</Text>
          <Text style={styles.heroBody}>{copy.body}</Text>
        </LinearGradient>

        <Text style={styles.featuresTitle}>Premium includes</Text>
        {[
          'Unlimited reads — no weekly cap',
          'Full premium story collection',
          "New AI stories as they're published",
          'Ad-free, child-safe experience',
        ].map((f) => (
          <Text key={f} style={styles.feature}>
            ✓ {f}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>{ui('payment.selectPlan')}</Text>

        <Pressable
          style={[styles.planCard, plan === 'yearly' && styles.planCardActive]}
          onPress={() => setPlan('yearly')}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>Yearly</Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveText}>{SUBSCRIPTION_PRICES.yearly.savings}</Text>
            </View>
          </View>
          <Text style={styles.planPrice}>
            {SUBSCRIPTION_PRICES.yearly.label}
            {method === 'telegram_stars' ? ` · ⭐ ${PLAN_STARS.yearly}` : ''}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.planCard, styles.planSecondary, plan === 'monthly' && styles.planCardActive]}
          onPress={() => setPlan('monthly')}>
          <Text style={styles.planName}>Monthly</Text>
          <Text style={styles.planPrice}>
            {SUBSCRIPTION_PRICES.monthly.label}
            {method === 'telegram_stars' ? ` · ⭐ ${PLAN_STARS.monthly}` : ''}
          </Text>
        </Pressable>

        <PaymentMethodPicker selected={method} onSelect={setMethod} />

        {method === 'card' && (
          <Text style={styles.methodHint}>{ui('payment.card.redirect')}</Text>
        )}

        <Pressable style={styles.payBtn} onPress={handlePay} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payBtnText}>
              {ui('payment.continue')}
              {starsLabel}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={handleRestore} disabled={restoring}>
          <Text style={styles.restore}>
            {restoring ? 'Restoring…' : 'Restore purchases'}
          </Text>
        </Pressable>

        <Text style={styles.legal}>
          Card: secure checkout. Crypto: ETH, TRC20, BTC, TON, or SOL. Telegram: Stars.
          Parents should complete purchases.
        </Text>
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
  close: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeText: {
    fontSize: 22,
    color: FairytaleTheme.textMuted,
  },
  hero: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  heroEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 30,
  },
  heroBody: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 12,
    lineHeight: 22,
  },
  featuresTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: FairytaleTheme.text,
    marginBottom: 12,
  },
  feature: {
    fontSize: 15,
    color: FairytaleTheme.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: FairytaleTheme.text,
    marginTop: 8,
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: FairytaleTheme.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: FairytaleTheme.border,
  },
  planCardActive: {
    borderColor: FairytaleTheme.primary,
  },
  planSecondary: {},
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: FairytaleTheme.text,
  },
  saveBadge: {
    backgroundColor: FairytaleTheme.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: FairytaleTheme.primary,
    marginTop: 4,
  },
  methodHint: {
    fontSize: 13,
    color: FairytaleTheme.textMuted,
    marginBottom: 12,
    textAlign: 'center',
  },
  payBtn: {
    backgroundColor: FairytaleTheme.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  payBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  restore: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
    fontWeight: '600',
    color: FairytaleTheme.primary,
  },
  legal: {
    fontSize: 11,
    color: FairytaleTheme.textMuted,
    marginTop: 24,
    lineHeight: 16,
    textAlign: 'center',
  },
});
