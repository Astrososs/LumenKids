import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  updateUserInDb, 
  findUserByEmail, 
  addFriendToDb, 
  removeFriendFromDb,
  fetchMultipleUserProfiles,
  getUserProfile
} from '../../models/userModel';


export const initAuth = createAsyncThunk('user/initAuth', async (_, { dispatch }) => {
  dispatch(setLoading(true));
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        if (profile) dispatch(loginSuccess(profile));
      } else {
        dispatch(logout());
      }
      dispatch(setLoading(false));
      resolve();
    });
    return unsubscribe;
  });
});


export const authenticateUser = createAsyncThunk(
  'user/authenticate',
  async ({ email, password, nickname, isRegistering }, { rejectWithValue }) => {
    try {
      let user;
      if (isRegistering) {
        user = await registerUser(email, password, nickname);
      } else {
        user = await loginUser(email, password);
      }
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const loadFriendsProfilesThunk = createAsyncThunk(
  'user/loadFriendsProfiles',
  async (friendUids, { rejectWithValue }) => {
    try {
      if (!friendUids || friendUids.length === 0) return [];
      return await fetchMultipleUserProfiles(friendUids);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const signOutUser = createAsyncThunk(
  'user/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveGameProgress = createAsyncThunk(
  'user/saveProgress',
  async ({ uid, missionId, result, xpGained }, { getState }) => {
    const state = getState();
    const currentUser = state.user.data;
    const currentXP = (currentUser.stats?.xp || 0) + xpGained;
    const currentStars = (currentUser.stats?.totalStars || 0) + result.stars;
    const newLevel = Math.floor(currentXP / 100) + 1;

    const updates = {
      [`progress.${missionId}`]: result,
      'stats.xp': currentXP,
      'stats.totalStars': currentStars,
      'stats.currentLevel': newLevel
    };

    await updateUserInDb(uid, updates);
    return { missionId, result, xp: currentXP, stars: currentStars, level: newLevel };
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

export const addFriendThunk = createAsyncThunk(
  'user/addFriend',
  async ({ uid, friendEmail }, { rejectWithValue }) => {
    try {
      const friend = await findUserByEmail(friendEmail);
      if (!friend) throw new Error("User not found!");
      if (friend.uid === uid) throw new Error("You cannot add yourself!");
      await addFriendToDb(uid, friend.uid);
      return friend; 
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFriendThunk = createAsyncThunk(
  'user/removeFriend',
  async ({ uid, friendUid }, { rejectWithValue }) => {
    try {
      await removeFriendFromDb(uid, friendUid);
      return friendUid;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    friendsProfiles: [], 
    loading: true, 
    error: null
  },
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload; },
    loginSuccess: (state, action) => { 
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.data = null;
      state.friendsProfiles = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(authenticateUser.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(authenticateUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(signOutUser.fulfilled, (state) => { state.data = null; state.loading = false; })
      .addCase(loadFriendsProfilesThunk.fulfilled, (state, action) => {
        state.friendsProfiles = action.payload;
      })
      .addCase(saveGameProgress.fulfilled, (state, action) => {
        if (state.data) {
           state.data.progress = { ...state.data.progress, [action.payload.missionId]: action.payload.result };
           state.data.stats.xp = action.payload.xp;
           state.data.stats.totalStars = action.payload.stars;
           state.data.stats.currentLevel = action.payload.level;
        }
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.data) {
          state.data = { ...state.data, ...action.payload };
          if (action.payload['stats.age']) state.data.stats.age = action.payload['stats.age'];
        }
      })
      .addCase(addFriendThunk.fulfilled, (state, action) => {
        if (state.data) {
          if (!state.data.friends) state.data.friends = [];
          if (!state.data.friends.includes(action.payload.uid)) state.data.friends.push(action.payload.uid);
        }
      })
      .addCase(removeFriendThunk.fulfilled, (state, action) => {
        if (state.data?.friends) {
          state.data.friends = state.data.friends.filter(id => id !== action.payload);
        }
      });
  }
});

export const { loginSuccess, logout, setLoading } = userSlice.actions;
export default userSlice.reducer;