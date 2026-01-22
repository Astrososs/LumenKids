import { createListenerMiddleware } from '@reduxjs/toolkit';
import { db } from '../../firebase/firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs,
  getDoc, 
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc,
  onSnapshot, 
  query, 
  orderBy, 
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';

import {
  coursesLoaded,
  courseAdded,
  courseUpdated,
  courseIdReplaced,
  courseDeleted,
  loadCourses,
} from '../slices/courseSlice';

import {
  profileLoaded,
  profileUpdated,
  progressSaved,
  dailyQuestUpdated,
  dailyQuestEnsured,
  loadUserProfile,
  ensureDailyQuest,
  userRegistered,
} from '../slices/userSlice';

import {
  chatDeleted,
  chatCreationRequested,
  userMessagePersistRequested,
  assistantMessagePersistRequested,
  chatSubscribeRequested,
  chatUnsubscribeRequested,
  setChatHistory,
  chatSubscribeSucceeded,
  chatSubscribeFailed,
} from '../slices/chatSlice';

import { generateDailyQuest, getLocalDateKey } from '../../utils/dailyQuest';

const persistenceMiddleware = createListenerMiddleware();

const pendingChatCreations = {};
let chatUnsubscribe = null;
let currentSubscribedUid = null;

persistenceMiddleware.startListening({
  actionCreator: loadCourses.pending,
  effect: async (action, listenerApi) => {
    const uid = action.meta.arg;
    
    try {
      const querySnapshot = await getDocs(collection(db, "users", uid, "courses"));
      const courses = querySnapshot.docs.map(docSnap => ({ 
        id: docSnap.id, 
        ...docSnap.data() 
      }));
      
      const validCourses = courses.filter(course => {
        if (course.id.startsWith('temp_')) {
          return false;
        }
        return true;
      });
      
      listenerApi.dispatch(coursesLoaded(validCourses));
    } catch (error) {
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: courseAdded,
  effect: async (action, listenerApi) => {
    const { uid, courseData } = action.payload;
    const tempId = courseData.id;
    
    if (!uid) {
      return;
    }
    
    try {
      const { id, ...dataToSave } = courseData;
      const docRef = await addDoc(collection(db, "users", uid, "courses"), {
        ...dataToSave,
        createdAt: new Date().toISOString()
      });
      
      const realId = docRef.id;
      
      if (tempId !== realId && tempId.startsWith('temp_')) {
        listenerApi.dispatch(courseIdReplaced({ 
          oldId: tempId,
          newId: realId,
          courseData: { ...dataToSave, id: realId }
        }));
      }
    } catch (error) {
      listenerApi.dispatch(courseDeleted({ uid, courseId: tempId }));
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: courseUpdated,
  effect: async (action, listenerApi) => {
    const { uid, courseId, courseData } = action.payload;
    const prevState = listenerApi.getOriginalState().courses;
    
    if (!uid) {
      return;
    }
    
    if (courseId.startsWith('temp_')) {
      return;
    }
    
    try {
      const courseRef = doc(db, "users", uid, "courses", courseId);
      const { id, ...dataToUpdate } = courseData;
      
      await updateDoc(courseRef, dataToUpdate);
    } catch (error) {
      const prevCourse = prevState.list.find(c => c.id === courseId);
      if (prevCourse) {
        listenerApi.dispatch(courseUpdated({ uid, courseId, courseData: prevCourse }));
      }
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: courseDeleted,
  effect: async (action, listenerApi) => {
    const { uid, courseId } = action.payload;
    const prevState = listenerApi.getOriginalState().courses;
    
    if (courseId.startsWith('temp_')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, "users", uid, "courses", courseId));
    } catch (error) {
      const deletedCourse = prevState.list.find(c => c.id === courseId);
      if (deletedCourse) {
        listenerApi.dispatch(courseAdded({ uid, courseData: deletedCourse }));
      }
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: userRegistered,
  effect: async (action, listenerApi) => {
    const { uid, email, nickname, age } = action.payload;
    
    try {
      const newUserProfile = {
        uid: uid,
        nickname: nickname || "New Explorer",
        email: email,
        createdAt: new Date().toISOString(),
        settings: {
          avatarId: "robot_blue_v1", 
          theme: "light"
        },
        stats: {
          xp: 0,
          currentLevel: 1,
          streakDays: 0,
          totalStars: 0,
          age: parseInt(age) || 10
        },
        progress: {},
        dailyQuest: null
      };
      
      await setDoc(doc(db, "users", uid), newUserProfile);
      
      listenerApi.dispatch(profileLoaded(newUserProfile));
    } catch (error) {
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: loadUserProfile.pending,
  effect: async (action, listenerApi) => {
    const uid = action.meta.arg;
    
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const profile = {
          uid: docSnap.id, 
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
        };
        listenerApi.dispatch(profileLoaded(profile));
      }
    } catch (error) {
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: ensureDailyQuest.pending,
  effect: async (action, listenerApi) => {
    const { uid } = action.meta.arg;
    
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return;
      
      const profile = docSnap.data();
      const today = getLocalDateKey();
      const existing = profile.dailyQuest;

      if (!existing || existing.dateKey !== today) {
        const newQuest = generateDailyQuest(today);
        
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { dailyQuest: newQuest });
        
        listenerApi.dispatch(dailyQuestEnsured(newQuest));
      } else {
        listenerApi.dispatch(dailyQuestEnsured(existing));
      }
    } catch (error) {
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: profileUpdated,
  effect: async (action, listenerApi) => {
    const { uid, data } = action.payload;
    
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, data);
    } catch (error) {
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: progressSaved,
  effect: async (action, listenerApi) => {
    const { uid, updates } = action.payload;
    
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, updates);
    } catch (error) {
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: dailyQuestUpdated,
  effect: async (action, listenerApi) => {
    const { uid, updates } = action.payload;
    
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, updates);
    } catch (error) {
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: chatSubscribeRequested,
  effect: async (action, listenerApi) => {
    const uid = action.payload;
    
    try {
      if (chatUnsubscribe && currentSubscribedUid !== uid) {
        chatUnsubscribe();
        chatUnsubscribe = null;
        currentSubscribedUid = null;
      }

      if (currentSubscribedUid === uid && chatUnsubscribe) {
        listenerApi.dispatch(chatSubscribeSucceeded());
        return;
      }

      const q = query(
        collection(db, "users", uid, "chats"), 
        orderBy("lastUpdated", "desc")
      );

      currentSubscribedUid = uid;
      chatUnsubscribe = onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
            lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate().toISOString() : data.lastUpdated
          };
        });
        
        listenerApi.dispatch(setChatHistory(chats));
      });
      
      listenerApi.dispatch(chatSubscribeSucceeded());
    } catch (error) {
      listenerApi.dispatch(chatSubscribeFailed(error.message));
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: chatUnsubscribeRequested,
  effect: async (action, listenerApi) => {
    if (chatUnsubscribe) {
      chatUnsubscribe();
      chatUnsubscribe = null;
      currentSubscribedUid = null;
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: chatDeleted,
  effect: async (action, listenerApi) => {
    const { uid, chatId } = action.payload;
    
    try {
      await deleteDoc(doc(db, "users", uid, "chats", chatId));
    } catch (error) {
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: chatCreationRequested,
  effect: async (action, listenerApi) => {
    const { uid, tempChatId, message } = action.payload;

    if (pendingChatCreations[tempChatId]) {
      return;
    }

    try {
      pendingChatCreations[tempChatId] = true;
      
      const chatRef = await addDoc(collection(db, "users", uid, "chats"), {
        title: message.slice(0, 30) + "...", 
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        messages: [{ role: 'user', content: message }]
      });
      
      const realChatId = chatRef.id;
      listenerApi.dispatch({ type: 'chat/mapChatId', payload: { fromId: tempChatId, toId: realChatId } });
      delete pendingChatCreations[tempChatId];
    } catch (error) {
      delete pendingChatCreations[tempChatId];
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: userMessagePersistRequested,
  effect: async (action, listenerApi) => {
    const { uid, chatId, message } = action.payload;
    const state = listenerApi.getState().chat;
    const resolvedChatId = state.idMap[chatId] || chatId;

    if (resolvedChatId.toString().startsWith('temp_')) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newState = listenerApi.getState().chat;
      const newResolvedId = newState.idMap[chatId] || chatId;
      
      if (newResolvedId.toString().startsWith('temp_')) {
        return;
      }

      try {
        const chatRef = doc(db, "users", uid, "chats", newResolvedId);
        await updateDoc(chatRef, {
          messages: arrayUnion({ role: 'user', content: message }),
          lastUpdated: serverTimestamp()
        });
      } catch (error) {
      }
    } else {
      try {
        const chatRef = doc(db, "users", uid, "chats", resolvedChatId);
        await updateDoc(chatRef, {
          messages: arrayUnion({ role: 'user', content: message }),
          lastUpdated: serverTimestamp()
        });
      } catch (error) {
      }
    }
  },
});

persistenceMiddleware.startListening({
  actionCreator: assistantMessagePersistRequested,
  effect: async (action, listenerApi) => {
    const { uid, chatId, message } = action.payload;
    const state = listenerApi.getState().chat;
    const resolvedChatId = state.idMap[chatId] || chatId;

    if (resolvedChatId.toString().startsWith('temp_')) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newState = listenerApi.getState().chat;
      const newResolvedId = newState.idMap[chatId] || chatId;
      
      if (newResolvedId.toString().startsWith('temp_')) {
        return;
      }

      try {
        const chatRef = doc(db, "users", uid, "chats", newResolvedId);
        await updateDoc(chatRef, {
          messages: arrayUnion({ role: 'assistant', content: message }),
          lastUpdated: serverTimestamp()
        });
      } catch (error) {
      }
    } else {
      try {
        const chatRef = doc(db, "users", uid, "chats", resolvedChatId);
        await updateDoc(chatRef, {
          messages: arrayUnion({ role: 'assistant', content: message }),
          lastUpdated: serverTimestamp()
        });
      } catch (error) {
      }
    }
  },
});

export default persistenceMiddleware;
