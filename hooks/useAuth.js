"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/utils/routes";

export function useAuth() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    router.push(ROUTES.DASHBOARD);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    router.push(ROUTES.DASHBOARD);
    return res;
  };

  const logout = async () => {
    await authService.logout();
    router.replace(ROUTES.LOGIN);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
}
