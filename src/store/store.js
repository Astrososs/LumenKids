import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';
import courseReducer from './slices/courseSlice'; 

export const store = configureStore({
    reducer: {
        user: userReducer, 
        chat: chatReducer,
        courses: courseReducer 
    }
});