export interface UserProfile {
  email: string;

  freeStoriesLeft: number;

  isPremium: boolean;

  _count: {
    stories: number;
  };
}