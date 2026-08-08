import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseApp } from "./config";

export const db = getFirestore(firebaseApp);

export async function getUserDoc(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function createUserDoc(uid, data) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, { ...data, createdAt: serverTimestamp() }, { merge: true });
}

export async function updateUserDoc(uid, data) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}
