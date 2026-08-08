import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { firebaseApp } from "./config";

export const storage = getStorage(firebaseApp);

export async function uploadFile(path, file) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteFile(path) {
  const storageRef = ref(storage, path);
  return deleteObject(storageRef);
}
