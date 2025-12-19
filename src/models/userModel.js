
import { auth, db } from "../firebase/firebaseConfig";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  
  const userProfile = await getUserProfile(uid);

  if (!userProfile) {
      throw new Error("User profile not found in database.");
  }

  return userProfile; 
};

export const registerUser = async (email, password, nickname) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

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
      totalStars: 0
    },
    progress: {} 
  };

  await setDoc(doc(db, "users", uid), newUserProfile);
  return newUserProfile;
};

export const logoutUser = async () => {
  await signOut(auth);
  return true;
};

export const getUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      uid: docSnap.id, 
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
    };
  } else {
    return null;
  }
};

export const updateUserInDb = async (uid, dataToUpdate) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, dataToUpdate);
};

