export interface GeneratedStory {
  id: string;

  title: string;
  content: string;

  imageUrl?: string | null;

  childName: string;
  age: number;
  theme: string;

  createdAt: string;

  isFavorite: boolean;
}