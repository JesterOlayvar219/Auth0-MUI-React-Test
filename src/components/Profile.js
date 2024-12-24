import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Box,
  CircularProgress,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { TextFields } from "@mui/icons-material";

function Profile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
          },
        });
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({
      name: user?.name,
      email: user?.email,
      additionalInfo: profileData?.additionalInfo,
      // Add other editable fields here
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessTokenSilently()}`,
        },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        setProfileData({ ...profileData, ...editedData });
        setIsEditing(false);
      }
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
    { label: "User ID", value: user?.sub, editable: false },
    {
      label: "Name",
      value: isEditing ? editedData.name : user?.name,
      editable: true,
    },
    {
      label: "Email",
      value: isEditing ? editedData.email : user?.email,
      editable: true,
    },
    {
      label: "Email Verified",
      value: user?.email_verified ? "Yes" : "No",
      editable: false,
    },
    {
      label: "Additional Info",
      value: isEditing
        ? editedData.additionalInfo
        : profileData?.additionalInfo,
      editable: true,
    },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" gutterBottom>
            Profile Information
          </Typography>
          {!isEditing ? (
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Edit Profile
            </Button>
          ) : (
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button variant="outlined" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
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
                      <TableCell>
                        {isEditing && row.editable ? (
                          <TextField
                            fullWidth
                            value={
                              editedData[
                                row.label.toLowerCase().replace(" ", "")
                              ]
                            }
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                [row.label.toLowerCase().replace(" ", "")]:
                                  e.target.value,
                              })
                            }
                          />
                        ) : (
                          row.value
                        )}
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default Profile;
