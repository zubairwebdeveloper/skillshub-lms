import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { db } from "@/lib/firebase/config";

export async function getChapters(courseId) {
  try {
    if (!courseId) {
      throw new Error("Course ID is required.");
    }

    const chaptersRef = collection(db, "courses", courseId, "chapters");

    const chaptersQuery = query(chaptersRef, orderBy("order", "asc"));

    const snapshot = await getDocs(chaptersQuery);

    const chapters = snapshot.docs.map((chapterDoc) => ({
      id: chapterDoc.id,
      ...chapterDoc.data(),
    }));

    return chapters;
  } catch (error) {
    console.error("getChapters error:", error);

    throw new Error(error?.message || "Failed to fetch chapters.");
  }
}
