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
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

function Profile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
  });

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

  const handleEdit = () => {
    setEditedData({
      name: user?.name,
      email: user?.email,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: editedData.name,
        email: editedData.email,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      name: user?.name,
      email: user?.email,
    });
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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h4">Profile Information</Typography>
          {!isEditing ? (
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          ) : (
            <Box>
              <IconButton color="primary" onClick={handleSave}>
                <SaveIcon />
              </IconButton>
              <IconButton color="error" onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </Box>
          )}
        </Box>

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
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ width: "30%", fontWeight: "bold" }}
                >
                  Name
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedData.name}
                      onChange={(e) =>
                        setEditedData({ ...editedData, name: e.target.value })
                      }
                    />
                  ) : (
                    user?.name
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ width: "30%", fontWeight: "bold" }}
                >
                  Email
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedData.email}
                      onChange={(e) =>
                        setEditedData({ ...editedData, email: e.target.value })
                      }
                    />
                  ) : (
                    user?.email
                  )}
                </TableCell>
              </TableRow>
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
