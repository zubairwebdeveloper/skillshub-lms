"use client";

import { useEffect, useState, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";

import { useAuth } from "./useAuth";
import { db } from "@/lib/firebase/firestore";

export function useUser() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile({
          uid: user.uid,
          ...docSnap.data(),
        });
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    profile,
    loading,
    error,
    refresh,
  };
}
