import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAupnzf6M4w8kqQuEgBHGvdLnjqtyDDc4M",
  authDomain: "lumenkids.firebaseapp.com",
  projectId: "lumenkids",
  storageBucket: "lumenkids.firebasestorage.app",
  messagingSenderId: "332163638558",
  appId: "1:332163638558:web:382ea68ce5b596a844150f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);