
export const userService = {
  async getProfile(userId) {
    const { data } = await api.get(`/users/${userId}`);
    return data.user;
  },

  async updateProfile(userId, updates) {
    const { data } = await api.patch(`/users/${userId}`, updates);
    return data.user;
  },

  async deleteAccount(userId) {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },
};
