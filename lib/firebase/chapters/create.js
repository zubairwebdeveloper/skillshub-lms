"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { db } from "@/lib/firebase/config";

const VALID_CONTENT_TYPES = ["youtube", "image", "video"];

/* =====================================================
   SHARED VALIDATION
===================================================== */

function validateChapterData(chapterData) {
  const { chapterTitle, videoTitle, contentType, youtubeVideoId, mediaUrl } =
    chapterData;

  if (!chapterTitle?.trim()) {
    throw new Error("Chapter title is required.");
  }

  if (!videoTitle?.trim()) {
    throw new Error("Video title is required.");
  }

  if (!VALID_CONTENT_TYPES.includes(contentType)) {
    throw new Error("A valid content type is required.");
  }

  if (contentType === "youtube" && !youtubeVideoId?.trim()) {
    throw new Error("YouTube video ID is required.");
  }

  if (
    (contentType === "image" || contentType === "video") &&
    !mediaUrl?.trim()
  ) {
    throw new Error(
      contentType === "image"
        ? "Image URL is required."
        : "Video URL is required.",
    );
  }
}

function buildChapterPayload(chapterData) {
  const {
    chapterTitle,
    videoTitle,
    contentType,
    youtubeVideoId,
    mediaUrl,
    thumbnailUrl,
    duration,
    description,
  } = chapterData;

  return {
    chapterTitle: chapterTitle.trim(),

    videoTitle: videoTitle.trim(),

    // "youtube" | "image" | "video"
    contentType,

    // Only populated when contentType === "youtube"
    youtubeVideoId: contentType === "youtube" ? youtubeVideoId.trim() : "",

    // Only populated when contentType === "image" | "video"
    mediaUrl:
      contentType === "image" || contentType === "video" ? mediaUrl.trim() : "",

    // Optional custom thumbnail (youtube/video only)
    thumbnailUrl: thumbnailUrl?.trim() || "",

    // Optional duration label, e.g. "12:45"
    duration: duration?.trim() || "",

    // Rich text HTML from Tiptap
    description: description || "",
  };
}

/* =====================================================
   CREATE
===================================================== */

export async function createChapter(courseId, chapterData) {
  try {
    const user = getAuth().currentUser;

    if (!user) {
      throw new Error("You must be signed in to create a chapter.");
    }

    if (!courseId) {
      throw new Error("Course ID is required.");
    }

    validateChapterData(chapterData);

    const chapter = {
      ...buildChapterPayload(chapterData),

      // Course owner
      instructorId: user.uid,

      // Useful for sorting chapters later
      order: Date.now(),

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    };

    const chapterRef = await addDoc(
      collection(db, "courses", courseId, "chapters"),
      chapter,
    );

    return {
      success: true,
      id: chapterRef.id,
      data: {
        id: chapterRef.id,
        ...chapter,
      },
    };
  } catch (error) {
    console.error("createChapter error:", error);

    throw new Error(error?.message || "Failed to create chapter.");
  }
}

/* =====================================================
   UPDATE
===================================================== */

export async function updateChapter(courseId, chapterId, chapterData) {
  try {
    const user = getAuth().currentUser;

    if (!user) {
      throw new Error("You must be signed in to update a chapter.");
    }

    if (!courseId) {
      throw new Error("Course ID is required.");
    }

    if (!chapterId) {
      throw new Error("Chapter ID is required.");
    }

    validateChapterData(chapterData);

    const chapterRef = doc(db, "courses", courseId, "chapters", chapterId);

    // Confirm the chapter exists before writing
    const existingSnap = await getDoc(chapterRef);

    if (!existingSnap.exists()) {
      throw new Error("Chapter not found.");
    }

    const updates = {
      ...buildChapterPayload(chapterData),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(chapterRef, updates);

    return {
      success: true,
      id: chapterId,
      data: {
        id: chapterId,
        ...existingSnap.data(),
        ...updates,
      },
    };
  } catch (error) {
    console.error("updateChapter error:", error);

    throw new Error(error?.message || "Failed to update chapter.");
  }
}

/* =====================================================
   DELETE
===================================================== */

export async function deleteChapter(courseId, chapterId) {
  try {
    const user = getAuth().currentUser;

    if (!user) {
      throw new Error("You must be signed in to delete a chapter.");
    }

    if (!courseId) {
      throw new Error("Course ID is required.");
    }

    if (!chapterId) {
      throw new Error("Chapter ID is required.");
    }

    const chapterRef = doc(db, "courses", courseId, "chapters", chapterId);

    const existingSnap = await getDoc(chapterRef);

    if (!existingSnap.exists()) {
      throw new Error("Chapter not found.");
    }

    await deleteDoc(chapterRef);

    return {
      success: true,
      id: chapterId,
    };
  } catch (error) {
    console.error("deleteChapter error:", error);

    throw new Error(error?.message || "Failed to delete chapter.");
  }
}
