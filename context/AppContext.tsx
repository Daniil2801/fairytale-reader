import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { t, type UiKey } from '@/constants/i18n';
import {
  loadLanguagePreferences,
  saveTextLanguage,
  saveVoiceLanguage,
  setVoiceFollowsText,
  type LanguagePreferences,
} from '@/services/languagePreferences';
import { localizeStory } from '@/services/localizedStory';
import type { AccessReason } from '@/services/entitlementService';
import {
  canAccessStory,
  loadEntitlements,
  recordStoryRead,
  setSubscriptionTier,
  weeklyReadsRemaining,
  weeklyReadsUsed,
} from '@/services/entitlementService';
import { getStories, isStoryReleased, refreshStories } from '@/services/storyService';
import { subscriptionService, type PlanId } from '@/services/subscriptionService';
import type { PaymentMethod } from '@/types/payment';
import type { AppLanguage } from '@/types/language';
import type { EntitlementState, Story } from '@/types/story';

interface AppContextValue {
  ready: boolean;
  stories: Story[];
  localizedStories: Story[];
  entitlements: EntitlementState;
  refreshing: boolean;
  textLanguage: AppLanguage;
  voiceLanguage: AppLanguage;
  voiceFollowsText: boolean;
  refresh: () => Promise<void>;
  checkAccess: (story: Story) => { allowed: boolean; reason: AccessReason };
  openStory: (storyId: string) => Promise<{ ok: boolean; reason?: AccessReason }>;
  purchase: (plan: PlanId, method?: PaymentMethod) => Promise<void>;
  restorePurchases: () => Promise<void>;
  devSetPremium: (enabled: boolean) => Promise<void>;
  setTextLanguage: (lang: AppLanguage) => Promise<void>;
  setVoiceLanguage: (lang: AppLanguage) => Promise<void>;
  setVoiceFollowsText: (follows: boolean) => Promise<void>;
  localize: (story: Story) => Story;
  ui: (key: UiKey) => string;
  readsRemaining: number;
  readsUsed: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  children,
  onReady,
}: {
  children: React.ReactNode;
  onReady?: () => void;
}) {
  const [ready, setReady] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [entitlements, setEntitlements] = useState<EntitlementState | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [langPrefs, setLangPrefs] = useState<LanguagePreferences | null>(null);

  const bootstrap = useCallback(async () => {
    const [ents, catalog, langs] = await Promise.all([
      loadEntitlements(),
      getStories(),
      loadLanguagePreferences(),
    ]);
    setEntitlements(ents);
    setStories(catalog);
    setLangPrefs(langs);
    setReady(true);
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [catalog, ents, langs] = await Promise.all([
        refreshStories(),
        loadEntitlements(),
        loadLanguagePreferences(),
      ]);
      setStories(catalog);
      setEntitlements(ents);
      setLangPrefs(langs);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const textLanguage = langPrefs?.textLanguage ?? 'en';
  const voiceLanguage = langPrefs?.voiceLanguage ?? 'en';
  const voiceFollowsText = langPrefs?.voiceFollowsText ?? true;

  const localizedStories = useMemo(
    () => stories.map((s) => localizeStory(s, textLanguage)),
    [stories, textLanguage],
  );

  const localize = useCallback(
    (story: Story) => localizeStory(story, textLanguage),
    [textLanguage],
  );

  const ui = useCallback((key: UiKey) => t(textLanguage, key), [textLanguage]);

  const applyLangPrefs = useCallback((prefs: LanguagePreferences) => {
    setLangPrefs(prefs);
  }, []);

  const handleSetTextLanguage = useCallback(
    async (lang: AppLanguage) => {
      const prefs = await saveTextLanguage(lang);
      applyLangPrefs(prefs);
    },
    [applyLangPrefs],
  );

  const handleSetVoiceLanguage = useCallback(
    async (lang: AppLanguage) => {
      const prefs = await saveVoiceLanguage(lang);
      applyLangPrefs(prefs);
    },
    [applyLangPrefs],
  );

  const handleSetVoiceFollowsText = useCallback(
    async (follows: boolean) => {
      const prefs = await setVoiceFollowsText(follows);
      applyLangPrefs(prefs);
    },
    [applyLangPrefs],
  );

  const checkAccess = useCallback(
    (story: Story) => {
      if (!entitlements) {
        return { allowed: false, reason: 'not_released' as const };
      }
      return canAccessStory(stateOrDefault(entitlements), story, isStoryReleased(story));
    },
    [entitlements],
  );

  const openStory = useCallback(
    async (storyId: string) => {
      const story = stories.find((s) => s.id === storyId);
      if (!story || !entitlements) {
        return { ok: false, reason: 'not_released' as const };
      }
      const access = canAccessStory(
        stateOrDefault(entitlements),
        story,
        isStoryReleased(story),
      );
      if (!access.allowed) {
        return { ok: false, reason: access.reason };
      }
      const next = await recordStoryRead(stateOrDefault(entitlements), storyId);
      setEntitlements(next);
      return { ok: true };
    },
    [entitlements, stories],
  );

  const purchase = useCallback(async (plan: PlanId, _method?: PaymentMethod) => {
    const ents = await loadEntitlements();
    if (ents.tier === 'premium') {
      setEntitlements(ents);
      return;
    }
    await setSubscriptionTier('premium');
    const updated = await loadEntitlements();
    setEntitlements(updated);
  }, []);

  const restorePurchases = useCallback(async () => {
    const tier = await subscriptionService.restorePurchases();
    await setSubscriptionTier(tier);
    const ents = await loadEntitlements();
    setEntitlements(ents);
  }, []);

  const devSetPremium = useCallback(async (enabled: boolean) => {
    await subscriptionService.devTogglePremium(enabled);
    const ents = await loadEntitlements();
    setEntitlements(ents);
  }, []);

  const value = useMemo<AppContextValue>(() => {
    const state = entitlements ?? defaultEntitlements();
    return {
      ready,
      stories,
      localizedStories,
      entitlements: state,
      refreshing,
      textLanguage,
      voiceLanguage,
      voiceFollowsText,
      refresh,
      checkAccess,
      openStory,
      purchase,
      restorePurchases,
      devSetPremium,
      setTextLanguage: handleSetTextLanguage,
      setVoiceLanguage: handleSetVoiceLanguage,
      setVoiceFollowsText: handleSetVoiceFollowsText,
      localize,
      ui,
      readsRemaining: weeklyReadsRemaining(state),
      readsUsed: weeklyReadsUsed(state),
    };
  }, [
    ready,
    stories,
    localizedStories,
    entitlements,
    refreshing,
    textLanguage,
    voiceLanguage,
    voiceFollowsText,
    refresh,
    checkAccess,
    openStory,
    purchase,
    restorePurchases,
    devSetPremium,
    handleSetTextLanguage,
    handleSetVoiceLanguage,
    handleSetVoiceFollowsText,
    localize,
    ui,
  ]);

  return <AppContext.Provider value={value}>{ready ? children : null}</AppContext.Provider>;
}

function stateOrDefault(state: EntitlementState): EntitlementState {
  return state;
}

function defaultEntitlements(): EntitlementState {
  return {
    tier: 'free',
    readsThisWeek: [],
    weekStartedAt: new Date().toISOString(),
  };
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
