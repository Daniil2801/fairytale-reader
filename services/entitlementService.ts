import { FREE_STORIES_PER_WEEK } from '@/constants/config';
import { getJson, setJson } from '@/lib/storage';
import { isSameWeek, startOfWeek } from '@/lib/dates';
import type { EntitlementState, ReadRecord, Story, SubscriptionTier } from '@/types/story';

const STORAGE_KEY = '@fairytale/entitlements';
const PREMIUM_PAYMENT_KEY = '@fairytale/premiumPaymentId';

function defaultState(): EntitlementState {
  return {
    tier: 'free',
    readsThisWeek: [],
    weekStartedAt: startOfWeek().toISOString(),
  };
}

function normalizeWeek(state: EntitlementState): EntitlementState {
  const weekStart = startOfWeek();
  if (isSameWeek(new Date(state.weekStartedAt), weekStart)) {
    return state;
  }
  return {
    ...state,
    readsThisWeek: [],
    weekStartedAt: weekStart.toISOString(),
  };
}

export async function loadEntitlements(): Promise<EntitlementState> {
  const state = normalizeWeek(await getJson(STORAGE_KEY, defaultState()));
  await setJson(STORAGE_KEY, state);
  return state;
}

export async function saveEntitlements(state: EntitlementState): Promise<void> {
  await setJson(STORAGE_KEY, normalizeWeek(state));
}

export async function setSubscriptionTier(tier: SubscriptionTier): Promise<EntitlementState> {
  const state = await loadEntitlements();
  const next = { ...state, tier };
  await saveEntitlements(next);
  return next;
}

export async function activatePremiumFromPayment(paymentId: string): Promise<EntitlementState> {
  await setJson(PREMIUM_PAYMENT_KEY, paymentId);
  return setSubscriptionTier('premium');
}

export async function getStoredPremiumPaymentId(): Promise<string | null> {
  return getJson<string | null>(PREMIUM_PAYMENT_KEY, null);
}

export function hasReadStory(state: EntitlementState, storyId: string): boolean {
  return state.readsThisWeek.some((r) => r.storyId === storyId);
}

export function weeklyReadsUsed(state: EntitlementState): number {
  return state.readsThisWeek.length;
}

export function weeklyReadsRemaining(state: EntitlementState): number {
  if (state.tier === 'premium') return Infinity;
  return Math.max(0, FREE_STORIES_PER_WEEK - state.readsThisWeek.length);
}

export type AccessReason =
  | 'allowed'
  | 'premium_required'
  | 'weekly_limit'
  | 'not_released';

export function canAccessStory(
  state: EntitlementState,
  story: Story,
  catalogAvailable: boolean,
): { allowed: boolean; reason: AccessReason } {
  if (!catalogAvailable) {
    return { allowed: false, reason: 'not_released' };
  }

  if (state.tier === 'premium') {
    return { allowed: true, reason: 'allowed' };
  }

  if (story.premiumOnly) {
    return { allowed: false, reason: 'premium_required' };
  }

  if (hasReadStory(state, story.id)) {
    return { allowed: true, reason: 'allowed' };
  }

  if (weeklyReadsUsed(state) >= FREE_STORIES_PER_WEEK) {
    return { allowed: false, reason: 'weekly_limit' };
  }

  return { allowed: true, reason: 'allowed' };
}

export async function recordStoryRead(
  state: EntitlementState,
  storyId: string,
): Promise<EntitlementState> {
  if (state.tier === 'premium' || hasReadStory(state, storyId)) {
    return state;
  }

  const record: ReadRecord = { storyId, readAt: new Date().toISOString() };
  const next: EntitlementState = {
    ...state,
    readsThisWeek: [...state.readsThisWeek, record],
  };
  await saveEntitlements(next);
  return next;
}
