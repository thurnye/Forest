import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Wonder, StudentProgress, BadgeType, WonderCategory, WonderContinent } from '../../types/explorer.types';
import { WONDERS_DATA } from '../../data/wonders.data';

interface ExplorerState {
  wonders: Wonder[];
  selectedWonder: Wonder | null;
  studentProgress: StudentProgress | null;
  filterCategory: WonderCategory | null;
  filterContinent: WonderContinent | null;
  searchQuery: string;
  mode: 'explorer' | 'quiz';
  showAchievement: boolean;
  latestBadge: BadgeType | null;
}

const initialState: ExplorerState = {
  wonders: WONDERS_DATA,
  selectedWonder: null,
  studentProgress: null,
  filterCategory: null,
  filterContinent: null,
  searchQuery: '',
  mode: 'explorer',
  showAchievement: false,
  latestBadge: null,
};

const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    selectWonder: (state, action: PayloadAction<string>) => {
      state.selectedWonder =
        state.wonders.find((w) => w.id === action.payload) || null;
    },
    clearSelectedWonder: (state) => {
      state.selectedWonder = null;
    },
    visitWonder: (state, action: PayloadAction<string>) => {
      const wonder = state.wonders.find((w) => w.id === action.payload);
      if (wonder && !wonder.isVisited) {
        wonder.isVisited = true;
        if (state.studentProgress) {
          state.studentProgress.wondersVisited += 1;

          // Award badges
          wonder.badges.forEach((badgeType) => {
            const badgeExists = state.studentProgress!.badges.some(
              (b) => b.type === badgeType
            );
            if (!badgeExists) {
              state.studentProgress!.badges.push({
                type: badgeType,
                earnedAt: new Date().toISOString(),
                isNew: true,
              });
              state.latestBadge = badgeType;
              state.showAchievement = true;
            }
          });
        }
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const wonder = state.wonders.find((w) => w.id === action.payload);
      if (wonder) {
        wonder.isFavorite = !wonder.isFavorite;
        if (state.studentProgress) {
          if (wonder.isFavorite) {
            state.studentProgress.favorites.push(action.payload);
          } else {
            state.studentProgress.favorites = state.studentProgress.favorites.filter(
              (id) => id !== action.payload
            );
          }
        }
      }
    },
    setFilterCategory: (state, action: PayloadAction<WonderCategory | null>) => {
      state.filterCategory = action.payload;
    },
    setFilterContinent: (state, action: PayloadAction<WonderContinent | null>) => {
      state.filterContinent = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setMode: (state, action: PayloadAction<'explorer' | 'quiz'>) => {
      state.mode = action.payload;
    },
    initializeProgress: (state, action: PayloadAction<string>) => {
      state.studentProgress = {
        studentId: action.payload,
        wondersVisited: 0,
        totalWonders: 196,
        badges: [],
        favorites: [],
        currentStreak: 0,
        quizScore: 0,
      };
    },
    hideAchievement: (state) => {
      state.showAchievement = false;
      // Mark badge as no longer new
      if (state.latestBadge && state.studentProgress) {
        const badge = state.studentProgress.badges.find(
          (b) => b.type === state.latestBadge
        );
        if (badge) {
          badge.isNew = false;
        }
      }
      state.latestBadge = null;
    },
    unlockNextWonder: (state) => {
      const nextLocked = state.wonders.find((w) => !w.isUnlocked);
      if (nextLocked) {
        nextLocked.isUnlocked = true;
      }
    },
  },
});

export const {
  selectWonder,
  clearSelectedWonder,
  visitWonder,
  toggleFavorite,
  setFilterCategory,
  setFilterContinent,
  setSearchQuery,
  setMode,
  initializeProgress,
  hideAchievement,
  unlockNextWonder,
} = explorerSlice.actions;

export default explorerSlice.reducer;
