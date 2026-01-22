import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUser,
  registerUser,
  logoutUser,
} from '../../models/userModel';

export const authenticateUser = createAsyncThunk(
  'user/authenticate',
  async ({ email, password, nickname, age, isRegistering }, { rejectWithValue, dispatch }) => {
    try {
      if (isRegistering) {
        const authResult = await registerUser(email, password);
        
        dispatch(userRegistered({ 
          uid: authResult.uid, 
          email: authResult.email,
          nickname, 
          age 
        }));
        
        return { uid: authResult.uid, loading: true };
      } else {
        const uid = await loginUser(email, password);
        dispatch(loadUserProfile(uid));
        return { uid, loading: true };
      }
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

export const loadUserProfile = createAsyncThunk(
  'user/loadProfile',
  async (uid, { rejectWithValue }) => {
    return uid;
  }
);

export const ensureDailyQuest = createAsyncThunk(
  'user/ensureDailyQuest',
  async ({ uid }, { rejectWithValue }) => {
    return uid;
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
    userRegistered: (state, action) => {
      state.loading = true;
    },
    profileLoaded: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    profileUpdated: (state, action) => {
      if (!state.data) return;
      const { data } = action.payload;
      
      if (data['stats.age'] !== undefined) {
        state.data.stats = state.data.stats || {};
        state.data.stats.age = data['stats.age'];
        const { 'stats.age': _, ...rest } = data;
        state.data = { ...state.data, ...rest };
      } else {
        state.data = { ...state.data, ...data };
      }
    },
    progressSaved: (state, action) => {
      if (!state.data) return;
      const { missionId, result, xp, stars, level, dailyQuest } = action.payload;
      
      state.data.progress = { ...(state.data.progress || {}), [missionId]: result };
      state.data.stats = state.data.stats || {};
      state.data.stats.xp = xp;
      state.data.stats.totalStars = stars;
      state.data.stats.currentLevel = level;
      state.data.dailyQuest = dailyQuest;
    },
    dailyQuestUpdated: (state, action) => {
      if (!state.data) return;
      const { dailyQuest } = action.payload;
      state.data.dailyQuest = dailyQuest;
      
      if (action.payload.xp !== undefined) {
        state.data.stats = state.data.stats || {};
        state.data.stats.xp = action.payload.xp;
        state.data.stats.currentLevel = action.payload.level;
      }
    },
    dailyQuestEnsured: (state, action) => {
      if (!state.data) return;
      state.data.dailyQuest = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.loading = true;
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
      .addCase(loadUserProfile.pending, (state) => {
        state.loading = true;
      });
  },
});

export const {
  setLoading,
  loginSuccess,
  logout,
  userRegistered,
  profileLoaded,
  profileUpdated,
  progressSaved,
  dailyQuestUpdated,
  dailyQuestEnsured,
} = userSlice.actions;

export default userSlice.reducer;
