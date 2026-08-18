import "server-only";

import { adminDb } from "@/lib/firebase/admin";

/* =========================================================
   COLLECTION
========================================================= */

const COURSES_COLLECTION = "courses";

/* =========================================================
   HELPERS
========================================================= */

/**
 * Converts a Firestore document snapshot into a plain,
 * serializable object safe to pass from a Server Component
 * / Route Handler down to Client Components.
 */
function serializeCourse(doc) {
  if (!doc.exists) return null;

  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    // Firestore Timestamps aren't serializable as-is — convert to ISO strings.
    createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.().toISOString() ?? null,
  };
}

/* =========================================================
   GET SINGLE COURSE BY ID
========================================================= */

/**
 * Fetches a single course document by its id.
 * Returns null if the course doesn't exist.
 *
 * Usage (edit form / course detail page):
 *   const course = await getCourseById(id);
 */
export async function getCourseById(id) {
  if (!id) {
    throw new Error("A course id is required.");
  }

  const docRef = adminDb.collection(COURSES_COLLECTION).doc(id);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return null;
  }

  return serializeCourse(snapshot);
}

/* =========================================================
   GET ALL COURSES FOR A GIVEN OWNER (instructor)
========================================================= */

/**
 * Fetches every course created by a given user, newest first.
 * Used by the "My Courses" list/dashboard.
 *
 * Usage:
 *   const courses = await getCoursesByOwner(uid);
 */
export async function getCoursesByOwner(uid) {
  if (!uid) {
    throw new Error("A user id is required.");
  }

  const snapshot = await adminDb
    .collection(COURSES_COLLECTION)
    .where("ownerId", "==", uid)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(serializeCourse);
}

/* =========================================================
   GET ALL PUBLISHED COURSES (public catalog)
========================================================= */

/**
 * Fetches every published course, newest first.
 * Used by the public course catalog / marketplace.
 *
 * Usage:
 *   const courses = await getPublishedCourses();
 */
export async function getPublishedCourses() {
  const snapshot = await adminDb
    .collection(COURSES_COLLECTION)
    .where("status", "==", "published")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(serializeCourse);
}

/* =========================================================
   GET COURSES BY CATEGORY (public catalog filter)
========================================================= */

/**
 * Fetches published courses filtered by category.
 *
 * Usage:
 *   const courses = await getCoursesByCategory("Development");
 */
export async function getCoursesByCategory(category) {
  if (!category) {
    throw new Error("A category is required.");
  }

  const snapshot = await adminDb
    .collection(COURSES_COLLECTION)
    .where("status", "==", "published")
    .where("category", "==", category)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(serializeCourse);
}
