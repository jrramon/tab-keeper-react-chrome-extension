import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { selectCategory, SettingsCategory } from './settingsCategoryStateSlice';
import { TabMasterContainer } from './tabContainerDataStateSlice';
import {
  saveToLocalStorage,
} from '../../utils/functions/local';

interface ConflictModalPayload {
  tabDataLocal: TabMasterContainer;
  tabDataCloud: TabMasterContainer;
}

export interface Global {
  hasSyncedBefore: boolean;
  isSignedIn: boolean;
  userId: string | null;
  isDirty: boolean;
  isSettingsPage: boolean;
  isSearchPanel: boolean;
  searchInputText: string;
  syncStatus: 'idle' | 'loading' | 'success' | 'error';
  isToastOpen: boolean;
  toastText: string;
  isConflictModalOpen: boolean;
  isRateAndReviewModalOpen: boolean;
  tabDataLocal: TabMasterContainer | null;
  tabDataCloud: TabMasterContainer | null;
}

export const initialState: Global = {
  hasSyncedBefore: false,
  isSignedIn: false,
  userId: null,
  isDirty: false,
  isSettingsPage: false,
  isSearchPanel: false,
  searchInputText: '',
  syncStatus: 'idle',
  isToastOpen: false,
  toastText: '',
  isConflictModalOpen: false,
  isRateAndReviewModalOpen: false,
  tabDataLocal: null,
  tabDataCloud: null,
};

// Save data to localStorage only (Firebase sync removed)
export const saveToLocalStorageIfDirty = createAsyncThunk(
  'global/saveToLocalStorageIfDirty',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;

    try {
      if (state.globalState.isDirty) {
        // Save to localStorage only
        saveToLocalStorage('tabContainerData', state.tabContainerDataState);
        thunkAPI.dispatch(setIsNotDirty());
      }
    } catch (error: any) {
      console.warn('Error saving to localStorage: ', error.message);
    }
  }
);

// Stub for backward compatibility - does nothing now
export const saveToFirestoreIfDirty = saveToLocalStorageIfDirty;

// Stub for backward compatibility - does nothing now
export const syncStateWithFirestore = createAsyncThunk(
  'global/syncStateWithFirestore',
  async () => {
    // No-op: Firebase sync removed, all data stays local
    console.log('Firebase sync has been removed - using local storage only');
  }
);

export const openSettingsPage = createAsyncThunk(
  'global/openSettingsPage',
  async (settingsName: SettingsCategory | undefined, thunkAPI) => {
    if (settingsName) thunkAPI.dispatch(selectCategory(settingsName));
  }
);

interface ShowToastPayload {
  toastText: string;
  duration?: number;
}

let toastTimeout: null | ReturnType<typeof setTimeout> = null;
export const showToast = createAsyncThunk(
  'global/showToast',
  async ({ toastText, duration = 5000 }: ShowToastPayload, thunkAPI) => {
    if (toastText) {
      // If there's an existing toast timeout, clear it
      if (toastTimeout !== null) {
        clearTimeout(toastTimeout);
        toastTimeout = null;
      }

      thunkAPI.dispatch(setToastText(toastText));
      thunkAPI.dispatch(openToast());

      // Set the new timeout for the current toast
      toastTimeout = setTimeout(() => {
        thunkAPI.dispatch(closeToast());
      }, duration);
    }
  }
);

export const globalStateSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {
    openConflictModal: (state, action: PayloadAction<ConflictModalPayload>) => {
      state.tabDataLocal = action.payload.tabDataLocal;
      state.tabDataCloud = action.payload.tabDataCloud;
      state.isConflictModalOpen = true;
    },

    closeConflictModal: (state) => {
      state.isConflictModalOpen = false;
    },

    openRateAndReviewModal: (state) => {
      state.isRateAndReviewModalOpen = true;
    },

    closeRateAndReviewModal: (state) => {
      state.isRateAndReviewModalOpen = false;
    },

    openSearchPanel: (state) => {
      state.isSearchPanel = true;
    },

    closeSearchPanel: (state) => {
      state.isSearchPanel = false;
    },

    setSearchInputText: (state, action: PayloadAction<string>) => {
      state.searchInputText = action.payload;
    },

    openToast: (state) => {
      state.isToastOpen = true;
    },

    closeToast: (state) => {
      state.isToastOpen = false;
    },

    setToastText: (state, action: PayloadAction<string>) => {
      state.toastText = action.payload;
    },

    closeSettingsPage: (state) => {
      state.isSettingsPage = false;
    },

    setIsNotDirty: (state) => {
      state.isDirty = false;
    },

    setIsDirty: (state) => {
      state.isDirty = true;
      state.syncStatus = 'idle';
    },

    setSignedIn: (state) => {
      state.isSignedIn = true;
    },

    setHasSyncedBefore: (state) => {
      state.hasSyncedBefore = true;
    },

    setLoggedOut: (state) => {
      state.isSignedIn = false;
      state.syncStatus = 'idle';
    },

    setSyncStatus: (
      state,
      action: PayloadAction<'idle' | 'loading' | 'success' | 'error'>
    ) => {
      state.syncStatus = action.payload;
    },

    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },

    removeUserId: (state) => {
      state.userId = null;
    },

    replaceState: (state, action: PayloadAction<typeof state>) =>
      action.payload,
  },

  extraReducers: (builder) => {
    builder
      .addCase(saveToLocalStorageIfDirty.pending, (state) => {
        state.syncStatus = 'loading';
      })
      .addCase(saveToLocalStorageIfDirty.fulfilled, (state) => {
        if (!state.isDirty) {
          state.syncStatus = 'success';
        } else {
          state.syncStatus = 'idle';
        }
      })
      .addCase(saveToLocalStorageIfDirty.rejected, (state) => {
        state.syncStatus = 'error';
      })
      .addCase(openSettingsPage.fulfilled, (state) => {
        state.isSettingsPage = true;
      })
      .addCase(showToast.fulfilled, () => {});
  },
});

export const {
  openConflictModal,
  closeConflictModal,
  openRateAndReviewModal,
  closeRateAndReviewModal,
  openSearchPanel,
  closeSearchPanel,
  setSearchInputText,
  openToast,
  closeToast,
  setToastText,
  closeSettingsPage,
  setIsDirty,
  setIsNotDirty,
  setSignedIn,
  setHasSyncedBefore,
  setLoggedOut,
  setSyncStatus,
  setUserId,
  removeUserId,
} = globalStateSlice.actions;

export default globalStateSlice.reducer;
