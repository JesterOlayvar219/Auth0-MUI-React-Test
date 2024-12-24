import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Avatar,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

function Profile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/data", {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [getAccessTokenSilently]);

  const updateProfile = async (additionalInfo) => {
    try {
      const response = await fetch("http://localhost:3000/api/data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessTokenSilently()}`,
        },
        body: JSON.stringify({
          additional_info: additionalInfo,
        }),
      });
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  const userInfo = [
    { label: "User ID", value: user?.sub },
    { label: "Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Email Verified", value: user?.email_verified ? "Yes" : "No" },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Information
        </Typography>

        <Box display="flex" justifyContent="center" mb={4}>
          <Avatar
            src={user?.picture}
            alt={user?.name}
            sx={{ width: 120, height: 120 }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {userInfo.map(
                (row) =>
                  row.value && (
                    <TableRow key={row.label}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ width: "30%", fontWeight: "bold" }}
                      >
                        {row.label}
                      </TableCell>
                      <TableCell>{row.value}</TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {userData && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Server Message
            </Typography>
            <Paper sx={{ p: 2 }}>
              <Typography>{userData.message}</Typography>
            </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Profile;
