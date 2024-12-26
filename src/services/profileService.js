import api from "./api";

export const profileService = {
  fetchUserData: async () => {
    const response = await api.get("/api/data");
    return response.data;
  },

  updateUserProfile: async (profileData) => {
    const response = await api.put("/api/data", profileData);
    return response.data;
  },
};
