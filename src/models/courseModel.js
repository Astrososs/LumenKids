import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export const fetchUserCourses = async (uid) => {
  try {
    const querySnapshot = await getDocs(collection(db, "users", uid, "courses"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export const saveCourseToDb = async (uid, courseData) => {
  try {
    const docRef = await addDoc(collection(db, "users", uid, "courses"), {
      ...courseData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...courseData };
  } catch (error) {
    console.error("Error saving course:", error);
    throw error;
  }
};

export const updateUserCourse = async (uid, courseId, updatedData) => {
  try {
    const courseRef = doc(db, "users", uid, "courses", courseId);
    await updateDoc(courseRef, updatedData);
    return { id: courseId, ...updatedData };
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

export const deleteUserCourse = async (uid, courseId) => {
  try {
    await deleteDoc(doc(db, "users", uid, "courses", courseId));
    return courseId;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};