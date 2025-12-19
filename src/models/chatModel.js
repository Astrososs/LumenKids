import { db } from "../firebase/firebaseConfig";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  arrayUnion,
  serverTimestamp
} from "firebase/firestore";

export const createNewChat = async (uid, firstMessage) => {
  try {
    const chatRef = await addDoc(collection(db, "users", uid, "chats"), {
      title: firstMessage.slice(0, 30) + "...", 
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      messages: [{ role: 'user', content: firstMessage }]
    });
    return chatRef.id;
  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
};

export const sendMessageToChat = async (uid, chatId, messageObj) => {
  try {
    const chatRef = doc(db, "users", uid, "chats", chatId);
    await updateDoc(chatRef, {
      messages: arrayUnion(messageObj),
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const deleteChat = async (uid, chatId) => {
  try {
    await deleteDoc(doc(db, "users", uid, "chats", chatId));
  } catch (error) {
    console.error("Error deleting chat:", error);
  }
};

export const subscribeToChats = (uid, callback) => {
  const q = query(
    collection(db, "users", uid, "chats"), 
    orderBy("lastUpdated", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate().toISOString() : data.lastUpdated
      };
    });
    
    callback(chats);
  });
};