"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { db } from "@/lib/firebase/config";

/**
 * Given the raw priceType/price/salePrice from a form, work out what
 * should actually be persisted to Firestore. A sale price is only kept
 * when the course is paid, a positive number was provided, and it is
 * strictly less than the regular price — otherwise it's dropped.
 */
function resolvePricingFields({ priceType, price, salePrice }) {
  const resolvedPrice = priceType === "paid" ? Number(price || 0) : 0;

  const parsedSalePrice = Number(salePrice);

  const hasValidSale =
    priceType === "paid" &&
    salePrice !== undefined &&
    salePrice !== null &&
    salePrice !== "" &&
    !Number.isNaN(parsedSalePrice) &&
    parsedSalePrice > 0 &&
    parsedSalePrice < resolvedPrice;

  return {
    price: resolvedPrice,
    // Firestore's addDoc silently drops `undefined` values, so this is
    // safe to always include — it simply won't be written when there's
    // no valid sale.
    salePrice: hasValidSale ? parsedSalePrice : undefined,
  };
}

/**
 * Create a new course
 *
 * Thumbnail upload is currently disabled.
 *
 * @param {Object} courseData
 * @returns {Promise<Object>}
 */
export async function createCourse(courseData) {
  try {
    const uid = getAuth().currentUser?.uid;

    if (!uid) {
      throw new Error("You must be signed in to create a course.");
    }

    const {
      title,
      shortDescription,
      description,
      category,
      language,
      level,
      priceType,
      price,
      salePrice,
    } = courseData;

    /*
    ==========================================
    1. Prepare Pricing
    ==========================================
    */

    const { price: resolvedPrice, salePrice: resolvedSalePrice } =
      resolvePricingFields({
        priceType,
        price,
        salePrice,
      });

    /*
    ==========================================
    2. Prepare Course Data
    ==========================================
    */

    const course = {
      title: title?.trim() || "",

      shortDescription: shortDescription?.trim() || "",

      // Rich text HTML from Tiptap
      description: description || "",

      category: category || "",

      language: language || "",

      level: level || "",

      priceType: priceType || "free",

      price: resolvedPrice,

      // Thumbnail temporarily disabled
      // thumbnailUrl: "",
      // thumbnailPath: "",

      status: "draft",

      // Course owner
      instructorId: uid,

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    };

    /*
    ==========================================
    3. Add Sale Price Only When Valid
    ==========================================
    
    IMPORTANT:
    Do NOT add salePrice when:
    - Course is free
    - salePrice is empty
    - salePrice is invalid
    */

    if (
      priceType === "paid" &&
      resolvedSalePrice !== undefined &&
      resolvedSalePrice !== null
    ) {
      course.salePrice = resolvedSalePrice;
    }

    /*
    ==========================================
    4. Save Course to Firestore
    ==========================================
    */

    const courseRef = await addDoc(collection(db, "courses"), course);

    /*
    ==========================================
    5. Return Created Course
    ==========================================
    */

    return {
      success: true,

      id: courseRef.id,

      data: {
        id: courseRef.id,
        ...course,
      },
    };
  } catch (error) {
    console.error("createCourse error:", error);

    throw new Error(error?.message || "Failed to create course.");
  }
}

/**
 * Update an existing course (edit form save)
 *
 * Thumbnail upload is currently disabled — same as createCourse.
 *
 * @param {string} courseId
 * @param {Object} courseData
 * @returns {Promise<Object>}
 */
export async function updateCourse(courseId, courseData) {
  try {
    if (!courseId) {
      throw new Error("Course ID is required.");
    }

    const {
      title,
      shortDescription,
      description,
      category,
      language,
      level,
      priceType,
      price,
      salePrice,
    } = courseData;

    /*
    ==========================================
    1. Prepare Updated Fields
    ==========================================
    */

    const { price: resolvedPrice, salePrice: resolvedSalePrice } =
      resolvePricingFields({ priceType, price, salePrice });

    const updates = {
      title: title.trim(),

      shortDescription: shortDescription.trim(),

      // Rich text HTML from Tiptap
      description,

      category,

      language,

      level,

      priceType,

      price: resolvedPrice,

      // Optional discounted price. When there's no valid sale we
      // explicitly clear any previously saved value with deleteField()
      // so an old sale price doesn't linger after it's removed.
      salePrice:
        resolvedSalePrice !== undefined ? resolvedSalePrice : deleteField(),

      updatedAt: serverTimestamp(),
    };

    /*
    ==========================================
    2. Save Updates to Firestore
    ==========================================
    */

    const courseRef = doc(db, "courses", courseId);

    await updateDoc(courseRef, updates);

    return {
      success: true,

      id: courseId,

      data: {
        id: courseId,
        ...updates,
        salePrice: resolvedSalePrice,
      },
    };
  } catch (error) {
    console.error("updateCourse error:", error);

    throw new Error(error?.message || "Failed to update course.");
  }
}

/**
 * Update only a course's status (publish / unpublish / draft)
 *
 * @param {string} courseId
 * @param {"draft" | "published"} status
 * @returns {Promise<Object>}
 */
export async function updateCourseStatus(courseId, status) {
  try {
    if (!courseId) {
      throw new Error("Course ID is required.");
    }

    if (!status) {
      throw new Error("Status is required.");
    }

    const courseRef = doc(db, "courses", courseId);

    await updateDoc(courseRef, {
      status,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      id: courseId,
      status,
    };
  } catch (error) {
    console.error("updateCourseStatus error:", error);

    throw new Error(error?.message || "Failed to update course status.");
  }
}

/**
 * Delete a course
 *
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function deleteCourse(courseId) {
  try {
    if (!courseId) {
      throw new Error("Course ID is required.");
    }

    const courseRef = doc(db, "courses", courseId);

    await deleteDoc(courseRef);

    return {
      success: true,
      id: courseId,
    };
  } catch (error) {
    console.error("deleteCourse error:", error);

    throw new Error(error?.message || "Failed to delete course.");
  }
}
