import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { dashboardService } from "../services/dashboardService";
import { setAuthToken } from "../services/api";

const Dashboard = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !isAuthenticated) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const token = await getAccessTokenSilently();
        setAuthToken(token);
        const result = await dashboardService.fetchDashboardData();
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (!isLoading) {
      fetchData();
    }
  }, [user, isAuthenticated, isLoading, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>User Email: {user?.email}</p>
      <p>Data from the backend: {data?.message}</p>
    </div>
  );
};

export default Dashboard;
