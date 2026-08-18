"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

/**
 * Get all courses
 */
export async function getCourses() {
  try {
    const coursesQuery = query(
      collection(db, "courses"),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(coursesQuery);

    const courses = snapshot.docs.map((courseDoc) => ({
      id: courseDoc.id,
      ...courseDoc.data(),
    }));

    return courses;
  } catch (error) {
    console.error("getCourses error:", error);

    throw new Error(error?.message || "Failed to fetch courses.");
  }
}

/**
 * Get single course by ID
 */
export async function getCourseById(courseId) {
  try {
    if (!courseId) {
      throw new Error("Course ID is required.");
    }

    const courseRef = doc(db, "courses", courseId);

    const snapshot = await getDoc(courseRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("getCourseById error:", error);

    throw new Error(error?.message || "Failed to fetch course.");
  }
}

/**
 * Get courses by category
 */
export async function getCoursesByCategory(category) {
  try {
    if (!category) {
      return [];
    }

    const snapshot = await getDocs(collection(db, "courses"));

    const courses = snapshot.docs
      .map((courseDoc) => ({
        id: courseDoc.id,
        ...courseDoc.data(),
      }))
      .filter((course) => course.category === category);

    return courses;
  } catch (error) {
    console.error("getCoursesByCategory error:", error);

    throw new Error(error?.message || "Failed to fetch courses.");
  }
}

/**
 * Get courses by status
 */
export async function getCoursesByStatus(status) {
  try {
    if (!status) {
      return [];
    }

    const snapshot = await getDocs(collection(db, "courses"));

    const courses = snapshot.docs
      .map((courseDoc) => ({
        id: courseDoc.id,
        ...courseDoc.data(),
      }))
      .filter((course) => course.status === status);

    return courses;
  } catch (error) {
    console.error("getCoursesByStatus error:", error);

    throw new Error(error?.message || "Failed to fetch courses.");
  }
}

/**
 * Subscribe to all published courses in realtime.
 * Public/browse page ke liye — koi bhi course publish/unpublish/edit hote hi
 * `onData` khud-ba-khud naye data ke sath call ho jayega, koi manual refetch nahi chahiye.
 *
 * @param {(courses: object[]) => void} onData
 * @param {(error: Error) => void} [onError]
 * @returns {() => void} unsubscribe function — cleanup ke liye zaroor call karein
 */
export function subscribeToPublishedCourses(onData, onError) {
  try {
    const coursesQuery = query(
      collection(db, "courses"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      coursesQuery,
      (snapshot) => {
        const courses = snapshot.docs.map((courseDoc) => ({
          id: courseDoc.id,
          ...courseDoc.data(),
        }));

        onData(courses);
      },
      (error) => {
        console.error("subscribeToPublishedCourses error:", error);

        onError?.(new Error(error?.message || "Failed to fetch courses."));
      },
    );

    return unsubscribe;
  } catch (error) {
    console.error("subscribeToPublishedCourses setup error:", error);

    onError?.(new Error(error?.message || "Failed to fetch courses."));

    return () => {};
  }
}

/**
 * Subscribe to a specific user's own courses in realtime.
 * "My Courses" dashboard (ListView) ke liye — user ID lazmi chahiye.
 *
 * @param {string} uid
 * @param {(courses: object[]) => void} onData
 * @param {(error: Error) => void} [onError]
 * @returns {() => void} unsubscribe function — cleanup ke liye zaroor call karein
 */
export function subscribeToUserCourses(uid, onData, onError) {
  try {
    if (!uid) {
      onError?.(new Error("You must be signed in to view your courses."));
      return () => {};
    }

    const coursesQuery = query(
      collection(db, "courses"),
      where("instructorId", "==", uid), // ⚠️ apni actual field ke naam se match karein
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      coursesQuery,
      (snapshot) => {
        const courses = snapshot.docs.map((courseDoc) => ({
          id: courseDoc.id,
          ...courseDoc.data(),
        }));

        onData(courses);
      },
      (error) => {
        console.error("subscribeToUserCourses error:", error);

        onError?.(new Error(error?.message || "Failed to fetch courses."));
      },
    );

    return unsubscribe;
  } catch (error) {
    console.error("subscribeToUserCourses setup error:", error);

    onError?.(new Error(error?.message || "Failed to fetch courses."));

    return () => {};
  }
}
