export enum WonderCategory {
  NATURAL = 'natural',
  MAN_MADE = 'man-made',
}

export enum WonderContinent {
  AFRICA = 'Africa',
  ASIA = 'Asia',
  EUROPE = 'Europe',
  AMERICAS = 'Americas',
  OCEANIA = 'Oceania',
}

export enum BadgeType {
  OCEAN_FINDER = 'Ocean Finder',
  HISTORY_HERO = 'History Hero',
  MOUNTAIN_MASTER = 'Mountain Master',
  NATURE_EXPLORER = 'Nature Explorer',
  ANCIENT_WONDER = 'Ancient Wonder',
  MODERN_MARVEL = 'Modern Marvel',
  DESERT_DISCOVERER = 'Desert Discoverer',
  FOREST_FRIEND = 'Forest Friend',
}

export interface Wonder {
  id: string;
  country: string;
  name: string;
  description: string;
  category: WonderCategory;
  continent: WonderContinent;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  isNew?: boolean;
  badges: BadgeType[];
  isUnlocked: boolean;
  isVisited: boolean;
  isFavorite: boolean;
}

export interface StudentProgress {
  studentId: string;
  wondersVisited: number;
  totalWonders: number;
  badges: {
    type: BadgeType;
    earnedAt: string;
    isNew: boolean;
  }[];
  favorites: string[]; // wonder IDs
  currentStreak: number;
  quizScore: number;
}

export interface QuizQuestion {
  id: string;
  wonderId: string;
  question: string;
  imageUrl: string;
  correctAnswer: boolean; // true for YES, false for NO
  category: 'natural' | 'man-made';
}
