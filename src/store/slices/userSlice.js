import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateUserInDb } from '../../models/userModel'; 


export const saveGameProgress = createAsyncThunk(
    'user/saveGame',
    async ({ uid, missionId, result, xpGained }, { getState }) => {
      
        const currentUserData = getState().user.data;
        
     
        const currentXp = currentUserData.stats.xp || 0;
        const currentLevel = currentUserData.stats.currentLevel || 1;
        
        const newXp = currentXp + xpGained;
        
       
        let newLevel = currentLevel;
        if (newXp >= 100) {
            newLevel = currentLevel + Math.floor(newXp / 100);
            
        }

       
        const updates = {
            [`progress.${missionId}`]: result, 
            "stats.xp": newXp,
            "stats.currentLevel": newLevel,
            "stats.lastActive": new Date().toISOString()
        };

       
        await updateUserInDb(uid, updates);

        
        return { missionId, result, newXp, newLevel };
    }
);

const initialState = {
    data: null,
    loading: false,
    isAuthenticated: false,
    error: null
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.data = action.payload;
            state.loading = false;
            state.isAuthenticated = true;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.data = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
       
        builder.addCase(saveGameProgress.fulfilled, (state, action) => {
            if (state.data) {
                const { missionId, result, newXp, newLevel } = action.payload;
                
              
                if (!state.data.progress) state.data.progress = {};
                state.data.progress[missionId] = result;

                
                state.data.stats.xp = newXp;
                state.data.stats.currentLevel = newLevel;
            }
        });
        
       
    }
});

export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer;