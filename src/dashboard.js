import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const auth0 = useAuth0();
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!auth0.user || !auth0.isAuthenticated) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const token = await auth0.getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "read:messages",
          },
        });

        console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/data`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (!auth0.isLoading) {
      fetchData();
    }
  }, [auth0]);

  if (auth0.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>User Email: {auth0.user?.email}</p>
      <p>Data from the backend: {data?.message}</p>
    </div>
  );
};

export default Dashboard;
