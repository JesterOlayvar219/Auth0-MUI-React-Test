import api from "./api";

export const dashboardService = {
  fetchDashboardData: async () => {
    const response = await api.get("/api/data");
    return response.data;
  },
};
