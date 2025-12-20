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
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
  arrayRemove 
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
    progress: {},
    friends: [] 
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
  }
  return null;
};

export const updateUserInDb = async (uid, dataToUpdate) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, dataToUpdate);
};

export const findUserByEmail = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const foundDoc = querySnapshot.docs[0];
  return { uid: foundDoc.id, ...foundDoc.data() };
};

export const addFriendToDb = async (uid, friendUid) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    friends: arrayUnion(friendUid) 
  });
};

export const removeFriendFromDb = async (uid, friendUid) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    friends: arrayRemove(friendUid)
  });
};

export const fetchMultipleUserProfiles = async (uids) => {
  if (!uids || uids.length === 0) return [];
  const profiles = await Promise.all(uids.map(uid => getUserProfile(uid)));
  return profiles.filter(p => p !== null);
};