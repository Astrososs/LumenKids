import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendMessageToAi } from '../../models/aiModel';

export const unsubscribeFromChatsThunk = createAsyncThunk('chat/unsubscribe', async (_, { dispatch }) => {
  dispatch(chatUnsubscribeRequested());
});

export const subscribeToChatsThunk = createAsyncThunk(
  'chat/subscribe',
  async (uid, { dispatch }) => {
    dispatch(chatSubscribeRequested(uid));
  }
);

export const handleUserMessage = createAsyncThunk(
  'chat/handleMessage',
  async ({ uid, chatId, tempChatId, message, userAge, history }, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    const localChatId = chatId || tempChatId;
    
    dispatch(
      upsertChatShell({
        id: localChatId,
        createdAt: new Date().toISOString(),
        messages: [],
      })
    );
    
    dispatch(
      appendMessage({
        chatId: localChatId,
        message: { role: 'user', content: message },
      })
    );
    
    if (!chatId) {
      dispatch(chatCreationRequested({ uid, tempChatId: localChatId, message }));
    } else {
      dispatch(userMessagePersistRequested({ uid, chatId, message }));
    }
    
    try {
      const context = (history || []).map((msg) => ({ role: msg.role, text: msg.content }));
      const aiResponseObj = await sendMessageToAi(message, userAge, context);
      
      const currentState = getState().chat;
      const targetChatId = currentState.idMap[localChatId] || chatId || localChatId;
      
      dispatch(
        appendMessage({
          chatId: targetChatId,
          message: { role: 'assistant', content: aiResponseObj.text },
        })
      );
      
      dispatch(assistantMessagePersistRequested({ 
        uid, 
        chatId: targetChatId, 
        message: aiResponseObj.text 
      }));
      
      return { 
        chatId: targetChatId, 
        tempChatId: tempChatId,
        localChatId: localChatId
      };
    } catch (err) {
      const safeChatId = chatId || localChatId;
      dispatch(
        appendMessage({
          chatId: safeChatId,
          message: {
            role: 'assistant',
            content: "Sorry — I couldn't answer that right now. Try again in a moment.",
          },
        })
      );
      return rejectWithValue({ message: err?.message || 'Failed to send message', chatId: safeChatId });
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    history: [],
    idMap: {},
    loadingChats: {},
    deleteStatus: 'idle',
    subscribeStatus: 'idle',
    error: null,
  },
  reducers: {
    setChatHistory: (state, action) => {
      state.history = action.payload || [];
    },
    mapChatId: (state, action) => {
      const { fromId, toId } = action.payload || {};
      if (!fromId || !toId || fromId === toId) return;
      
      state.idMap[fromId] = toId;
      
      if (state.loadingChats[fromId]) {
        state.loadingChats[toId] = state.loadingChats[fromId];
        delete state.loadingChats[fromId];
      }
      
      const localChat = state.history.find(c => c.id === fromId);
      if (localChat) {
        localChat.id = toId;
      }
    },
    upsertChatShell: (state, action) => {
      const chat = action.payload;
      if (!chat?.id) return;
      
      const idx = state.history.findIndex((c) => c.id === chat.id);
      if (idx === -1) {
        state.history.unshift({
          id: chat.id,
          messages: Array.isArray(chat.messages) ? chat.messages : [],
          ...chat,
        });
      }
    },
    appendMessage: (state, action) => {
      const { chatId, message } = action.payload || {};
      if (!chatId || !message) return;
      
      const resolvedId = state.idMap[chatId] || chatId;
      const idx = state.history.findIndex((c) => c.id === resolvedId);
      
      if (idx !== -1) {
        const existing = state.history[idx];
        const msgs = Array.isArray(existing.messages) ? existing.messages : [];
        existing.messages = [...msgs, message];
      }
    },
    chatDeleted: (state, action) => {
      const { chatId } = action.payload;
      state.history = state.history.filter((c) => c.id !== chatId);
      
      for (const [tempId, realId] of Object.entries(state.idMap)) {
        if (realId === chatId || tempId === chatId) delete state.idMap[tempId];
      }
    },
    chatCreationRequested: (state, action) => {
    },
    userMessagePersistRequested: (state, action) => {
    },
    assistantMessagePersistRequested: (state, action) => {
    },
    chatSubscribeRequested: (state, action) => {
      state.subscribeStatus = 'loading';
    },
    chatUnsubscribeRequested: (state, action) => {
    },
    chatSubscribeSucceeded: (state) => {
      state.subscribeStatus = 'succeeded';
    },
    chatSubscribeFailed: (state, action) => {
      state.subscribeStatus = 'failed';
      state.error = action.payload || 'Failed to subscribe';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToChatsThunk.fulfilled, (state) => {
      })
      .addCase(unsubscribeFromChatsThunk.fulfilled, (state) => {
        state.subscribeStatus = 'idle';
      })
      .addCase(handleUserMessage.pending, (state, action) => {
        const { chatId, tempChatId } = action.meta.arg;
        const targetId = chatId || tempChatId;
        
        if (targetId) {
          state.loadingChats[targetId] = true;
        }
        state.error = null;
      })
      .addCase(handleUserMessage.fulfilled, (state, action) => {
        const { chatId, tempChatId, localChatId } = action.payload;
        
        if (localChatId) delete state.loadingChats[localChatId];
        if (tempChatId) delete state.loadingChats[tempChatId];
        if (chatId) delete state.loadingChats[chatId];
        
        const resolvedId = state.idMap[localChatId] || state.idMap[tempChatId];
        if (resolvedId) delete state.loadingChats[resolvedId];
      })
      .addCase(handleUserMessage.rejected, (state, action) => {
        const { chatId, tempChatId } = action.meta.arg;
        const idToClear = action.payload?.chatId || chatId || tempChatId;
        
        if (idToClear) {
          delete state.loadingChats[idToClear];
          const resolvedId = state.idMap[idToClear];
          if (resolvedId) delete state.loadingChats[resolvedId];
        }
        
        state.error = action.payload?.message || action.error?.message || 'Failed to send message';
      });
  },
});

export const {
  setChatHistory,
  mapChatId,
  upsertChatShell,
  appendMessage,
  chatDeleted,
  chatCreationRequested,
  userMessagePersistRequested,
  assistantMessagePersistRequested,
  chatSubscribeRequested,
  chatUnsubscribeRequested,
  chatSubscribeSucceeded,
  chatSubscribeFailed,
} = chatSlice.actions;

export default chatSlice.reducer;
