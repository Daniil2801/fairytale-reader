export type StoryTheme =
  | 'friendship'
  | 'courage'
  | 'kindness'
  | 'adventure'
  | 'nature'
  | 'bedtime';

export type SceneAnimation = 'float' | 'twinkle' | 'bounce' | 'drift' | 'sway' | 'pulse';

/** One illustrated scene per story page (same order as `content`) */
export interface StoryScene {
  /** Decorative characters / objects matched to this page's text */
  emojis: string[];
  gradient: [string, string];
  animation: SceneAnimation;
  /** Illustration matched to this page's moment */
  imageUrl?: string;
  /** Short caption from the page text */
  momentLabel?: string;
  /** Internal: matched visual concept (for debugging / API) */
  visualKey?: string;
}

export interface Story {
  id: string;
  title: string;
  summary: string;
  /** Paragraphs for the reader */
  content: string[];
  theme: StoryTheme;
  ageMin: number;
  ageMax: number;
  readingMinutes: number;
  createdAt: string;
  /** ISO date when the story becomes visible in the catalog */
  availableFrom: string;
  /** Only subscribers can read */
  premiumOnly: boolean;
  coverEmoji: string;
  /** Per-page art & animation; auto-generated when omitted */
  scenes?: StoryScene[];
}

export interface StoryCatalog {
  stories: Story[];
  updatedAt: string;
}

export interface ReadRecord {
  storyId: string;
  readAt: string;
}

export type SubscriptionTier = 'free' | 'premium';

export interface EntitlementState {
  tier: SubscriptionTier;
  readsThisWeek: ReadRecord[];
  weekStartedAt: string;
}
