import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    data: null,
    loading: false,
    isAuthenticated: false,
    error: null
}

const userSlice = createSlice(
    {
        name: 'users',
        initialState,

        reducers: {

            loginStart: (state) => {
                state.error = null
                state.loading = true
            },

            loginSuccess: (state, action) => {
                state.data = action.payload
                state.loading = false
                state.isAuthenticated = true
                state.error = null
            },

            loginFailure: (state, action) => {
                state.error = action.payload
                state.loading = false
                state.isAuthenticated = false
            },

            logout: (state) => {
                state.data = null
                state.loading = false
                state.isAuthenticated = false
                state.error = null
            },

            updateUserSettings: (state, action) => {
                if (state.data) {
                    state.data.settings = { ...state.data.settings, ...action.payload };
                }
            },

            addExperience: (state, action) => {
                if (state.data) {
                    state.data.stats.xp += action.payload;

                    while (state.data.stats.xp >= 100) {
                        state.data.stats.xp -= 100;
                        state.data.stats.currentLevel += 1;
                    }
                }
            },


            updateMissionProgress: (state, action) => {
                if (state.data) {
                    const { missionId, result } = action.payload;

                    state.data.progress[missionId] = result;
                    
            }
        }
        }
    }
)


export const { loginStart, loginSuccess, loginFailure, logout , updateMissionProgress, updateUserSettings, addExperience} = userSlice.actions

export default userSlice.reducer