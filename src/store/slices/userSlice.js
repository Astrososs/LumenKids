import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

import {
  loginUser,
  registerUser,
  logoutUser,
  updateUserInDb,
  getUserProfile,
} from '../../models/userModel';

import { generateDailyQuest, getLocalDateKey } from '../../utils/dailyQuest';

export const initAuth = createAsyncThunk('user/initAuth', async (_, { dispatch }) => {
  dispatch(setLoading(true));
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            dispatch(loginSuccess(profile));
          } else {
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      } catch (e) {
        console.error('initAuth failed:', e);
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
        resolve();
      }
    });
    return unsubscribe;
  });
});

export const authenticateUser = createAsyncThunk(
  'user/authenticate',
  async ({ email, password, nickname, age, isRegistering }, { rejectWithValue }) => {
    try {
      let userProfile;
      if (isRegistering) {
        userProfile = await registerUser(email, password, nickname, age);
      } else {
        userProfile = await loginUser(email, password);
      }
      return userProfile;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const signOutUser = createAsyncThunk('user/signOut', async (_, { rejectWithValue }) => {
  try {
    await logoutUser();
    return true;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const ensureDailyQuest = createAsyncThunk(
  'user/ensureDailyQuest',
  async ({ uid }, { rejectWithValue }) => {
    try {
      const profile = await getUserProfile(uid);
      if (!profile) throw new Error('User profile not found');

      const today = getLocalDateKey();
      const existing = profile.dailyQuest;

      if (!existing || existing.dateKey !== today) {
        const newQuest = generateDailyQuest(today);
        await updateUserInDb(uid, { dailyQuest: newQuest });
        return newQuest;
      }

      return existing;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const claimDailyQuestReward = createAsyncThunk(
  'user/claimDailyQuestReward',
  async ({ uid }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.user.data;
      const dq = user?.dailyQuest;

      if (!dq) throw new Error('No daily quest');
      if (!dq.completed) throw new Error('Quest not completed');
      if (dq.claimed) throw new Error('Reward already claimed');

      const rewardXp = dq.rewardXp || 0;
      const currentXP = user?.stats?.xp || 0;
      const newXP = currentXP + rewardXp;
      const newLevel = Math.floor(newXP / 100) + 1;

      const updatedQuest = { ...dq, claimed: true };

      await updateUserInDb(uid, {
        dailyQuest: updatedQuest,
        'stats.xp': newXP,
        'stats.currentLevel': newLevel,
      });

      return { dailyQuest: updatedQuest, xp: newXP, level: newLevel };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveGameProgress = createAsyncThunk(
  'user/saveProgress',
  async ({ uid, missionId, result, xpGained }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentUser = state.user.data;

      const wasCompletedBefore = !!currentUser?.progress?.[missionId];

      const todayKey = getLocalDateKey();
      let dailyQuest = currentUser?.dailyQuest;
      if (!dailyQuest || dailyQuest.dateKey !== todayKey) {
        dailyQuest = generateDailyQuest(todayKey);
      }

      const currentXP = (currentUser?.stats?.xp || 0) + (xpGained || 0);
      const currentStars = (currentUser?.stats?.totalStars || 0) + (result?.stars || 0);
      const newLevel = Math.floor(currentXP / 100) + 1;

      let updatedDailyQuest = dailyQuest;
      if (!wasCompletedBefore && dailyQuest?.type === 'COMPLETE_MISSIONS' && !dailyQuest.completed) {
        const nextProgress = Math.min(dailyQuest.target, (dailyQuest.progress || 0) + 1);
        updatedDailyQuest = {
          ...dailyQuest,
          progress: nextProgress,
          completed: nextProgress >= dailyQuest.target,
        };
      }

      const updates = {
        [`progress.${missionId}`]: result,
        'stats.xp': currentXP,
        'stats.totalStars': currentStars,
        'stats.currentLevel': newLevel,
        dailyQuest: updatedDailyQuest,
      };

      await updateUserInDb(uid, updates);

      return {
        missionId,
        result,
        xp: currentXP,
        stars: currentStars,
        level: newLevel,
        dailyQuest: updatedDailyQuest,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ uid, data }, { rejectWithValue }) => {
    try {
      await updateUserInDb(uid, data);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: true,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    loginSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(signOutUser.fulfilled, (state) => {
        state.data = null;
        state.loading = false;
        state.error = null;
      })

      .addCase(saveGameProgress.fulfilled, (state, action) => {
        if (!state.data) return;
        state.data.progress = { ...(state.data.progress || {}), [action.payload.missionId]: action.payload.result };
        state.data.stats = state.data.stats || {};
        state.data.stats.xp = action.payload.xp;
        state.data.stats.totalStars = action.payload.stars;
        state.data.stats.currentLevel = action.payload.level;
        state.data.dailyQuest = action.payload.dailyQuest;
      })

      .addCase(ensureDailyQuest.fulfilled, (state, action) => {
        if (state.data) state.data.dailyQuest = action.payload;
      })

      .addCase(claimDailyQuestReward.fulfilled, (state, action) => {
        if (!state.data) return;
        state.data.dailyQuest = action.payload.dailyQuest;
        state.data.stats = state.data.stats || {};
        state.data.stats.xp = action.payload.xp;
        state.data.stats.currentLevel = action.payload.level;
      })

      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (!state.data) return;

        state.data = { ...state.data, ...action.payload };

        if (action.payload['stats.age'] !== undefined) {
          state.data.stats = state.data.stats || {};
          state.data.stats.age = action.payload['stats.age'];
        }
      });
  },
});

export const { loginSuccess, logout, setLoading } = userSlice.actions;
export default userSlice.reducer;
