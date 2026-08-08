import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { firebaseApp } from "./config";

export const auth = getAuth(firebaseApp);

export async function registerWithEmail(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(cred.user, { displayName: name });
  return cred.user;
}

export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout() {
  return signOut(auth);
}

export async function requestPasswordReset(email) {
  return sendPasswordResetEmail(auth, email);
}

export async function resetPassword(oobCode, newPassword) {
  return confirmPasswordReset(auth, oobCode, newPassword);
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}
