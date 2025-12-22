import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createNewChat,
  sendMessageToChat,
  deleteChat,
  subscribeToChats,
} from '../../models/chatModel';
import { sendMessageToAi } from '../../models/aiModel';

const pendingCreations = {};

let unsubscribeFromChats = null;
let subscribedUid = null;

export const unsubscribeFromChatsThunk = createAsyncThunk('chat/unsubscribe', async () => {
  if (unsubscribeFromChats) {
    unsubscribeFromChats();
    unsubscribeFromChats = null;
    subscribedUid = null;
  }
});

export const subscribeToChatsThunk = createAsyncThunk(
  'chat/subscribe',
  async (uid, { dispatch }) => {
    if (subscribedUid === uid && unsubscribeFromChats) return;

    if (unsubscribeFromChats) {
      unsubscribeFromChats();
      unsubscribeFromChats = null;
      subscribedUid = null;
    }

    subscribedUid = uid;
    unsubscribeFromChats = subscribeToChats(uid, (chats) => {
      dispatch(setChatHistory(chats));
    });
  }
);

export const deleteChatThunk = createAsyncThunk(
  'chat/delete',
  async ({ uid, chatId }, { rejectWithValue }) => {
    try {
      await deleteChat(uid, chatId);
      return chatId;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to delete chat');
    }
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

    const currentState = getState().chat;
    let activeId = (chatId && currentState.idMap[chatId]) ? currentState.idMap[chatId] : chatId;

    try {
      const isTempId = activeId && activeId.toString().startsWith('temp_');

      if (isTempId && pendingCreations[activeId]) {
         activeId = await pendingCreations[activeId];
      } 
      else if (!activeId || (isTempId && !pendingCreations[activeId])) {
        const tempKey = tempChatId || activeId;
        
        const creationPromise = createNewChat(uid, message).then((realId) => {
            if (tempKey) {
                dispatch(mapChatId({ fromId: tempKey, toId: realId }));
            }
            return realId;
        });

        if (tempKey) {
            pendingCreations[tempKey] = creationPromise;
        }

        activeId = await creationPromise;
        
        if (tempKey) delete pendingCreations[tempKey];
      } else {
        await sendMessageToChat(uid, activeId, { role: 'user', content: message });
      }
      const context = (history || []).map((msg) => ({ role: msg.role, text: msg.content }));
      const aiResponseObj = await sendMessageToAi(message, userAge, context);

      dispatch(
        appendMessage({
          chatId: activeId,
          message: { role: 'assistant', content: aiResponseObj.text },
        })
      );
      await sendMessageToChat(uid, activeId, { role: 'assistant', content: aiResponseObj.text });

      return { chatId: activeId, tempChatId: tempChatId };

    } catch (err) {
      const safeChatId = activeId || chatId || tempChatId;
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
        state.loadingChats[toId] = true;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToChatsThunk.pending, (state) => {
        state.subscribeStatus = 'loading';
        state.error = null;
      })
      .addCase(subscribeToChatsThunk.fulfilled, (state) => {
        state.subscribeStatus = 'succeeded';
      })
      .addCase(subscribeToChatsThunk.rejected, (state, action) => {
        state.subscribeStatus = 'failed';
        state.error = action.payload || action.error?.message || 'Failed to subscribe';
      })
      .addCase(unsubscribeFromChatsThunk.fulfilled, (state) => {
        state.subscribeStatus = 'idle';
      })

      .addCase(handleUserMessage.pending, (state, action) => {
        const { chatId, tempChatId } = action.meta.arg;
        
        const resolvedChatId = state.idMap[chatId] || chatId;
        const targetId = resolvedChatId || tempChatId;
        
        if (targetId) {
            state.loadingChats[targetId] = true;
        }
        state.error = null;
      })
      .addCase(handleUserMessage.fulfilled, (state, action) => {
        const { chatId, tempChatId } = action.payload;
        if (chatId) delete state.loadingChats[chatId];
        if (tempChatId) delete state.loadingChats[tempChatId];
      })
      .addCase(handleUserMessage.rejected, (state, action) => {
        const idToClear = action.payload?.chatId || action.meta.arg.chatId || action.meta.arg.tempChatId;
        if (idToClear) delete state.loadingChats[idToClear];
        
        state.error = action.payload?.message || action.error?.message || 'Failed to send message';
      })

      .addCase(deleteChatThunk.pending, (state) => {
        state.deleteStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteChatThunk.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        const deletedId = action.payload;
        state.history = state.history.filter((c) => c.id !== deletedId);
        for (const [tempId, realId] of Object.entries(state.idMap)) {
          if (realId === deletedId || tempId === deletedId) delete state.idMap[tempId];
        }
      })
      .addCase(deleteChatThunk.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload || action.error?.message || 'Failed to delete chat';
      });
  },
});

export const { setChatHistory, mapChatId, upsertChatShell, appendMessage } = chatSlice.actions;
export default chatSlice.reducer;