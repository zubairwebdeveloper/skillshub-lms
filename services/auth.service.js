import {
  loginWithEmail,
  registerWithEmail,
  logout as firebaseLogout,
  requestPasswordReset,
  resetPassword,
} from "../lib/firebase/auth";

export const authService = {
  async login(email, password) {
    const firebaseUser = await loginWithEmail(email, password);
    const token = await firebaseUser.getIdToken();
    if (typeof window !== "undefined") {
      window.localStorage.setItem("authToken", token);
    }
    const { data } = await api.post("/auth/login", { firebaseUid: firebaseUser.uid });
    return { firebaseUser, dbUser: data.user };
  },

  async register(name, email, password) {
    const firebaseUser = await registerWithEmail(name, email, password);
    const token = await firebaseUser.getIdToken();
    if (typeof window !== "undefined") {
      window.localStorage.setItem("authToken", token);
    }
    const { data } = await api.post("/auth/register", {
      firebaseUid: firebaseUser.uid,
      name,
      email,
    });
    return { firebaseUser, dbUser: data.user };
  },

  async logout() {
    await firebaseLogout();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("authToken");
    }
  },

  forgotPassword(email) {
    return requestPasswordReset(email);
  },

  resetPassword(oobCode, newPassword) {
    return resetPassword(oobCode, newPassword);
  },
};
