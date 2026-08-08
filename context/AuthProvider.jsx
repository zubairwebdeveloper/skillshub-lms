"use client";

import { createContext, useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../lib/firebase/auth";

export const AuthContext = createContext({
  user: null,
  loading: true,
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        if (typeof window !== "undefined") {
          window.localStorage.setItem("authToken", token);
        }
        setUser(firebaseUser);
      } else {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("authToken");
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
