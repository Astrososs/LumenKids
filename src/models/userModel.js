
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
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
   
    const userProfile = await getUserProfile(uid);
    return { success: true, user: userProfile };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const registerUser = async (email, password, nickname) => {
  try {
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

    return { success: true, user: newUserProfile };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUserInDb = async (uid, dataToUpdate) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating DB:", error);
  }
};