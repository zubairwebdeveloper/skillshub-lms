import { uploadFile } from "../lib/firebase/storage";
import api from "../lib/mongodb/axios";

export const uploadService = {
  async uploadAvatar(userId, file) {
    const path = `avatars/${userId}/${file.name}`;
    const avatarUrl = await uploadFile(path, file);
    const { data } = await api.patch(`/users/${userId}`, { avatarUrl });
    return data.user;
  },
};
