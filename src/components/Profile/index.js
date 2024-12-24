import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Box } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ServerMessage from "./ServerMessage";
import LoadingSpinner from "./LoadingSpinner";

function Profile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
  });

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

  useEffect(() => {
    if (userData?.user) {
      setEditedData({
        name: userData.user.name || user?.name,
        email: userData.user.email || user?.email,
      });
    }
  }, [userData, user]);

  useEffect(() => {
    fetchUserData();
  }, [getAccessTokenSilently]);

  const updateProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessTokenSilently()}`,
        },
        body: JSON.stringify({
          name: editedData.name,
          email: editedData.email,
        }),
      });
      const data = await response.json();

      setUserData(data);
      setEditedData({
        name: data.user.name,
        email: data.user.email,
      });

      await fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleEdit = () => {
    setEditedData({
      name: userData?.user?.name || user?.name,
      email: userData?.user?.email || user?.email,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Validate before saving
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedData.email);
    const isNameValid = editedData.name.trim().length >= 2;

    if (!isEmailValid || !isNameValid) {
      return;
    }

    try {
      await updateProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      name: userData?.user?.name || user?.name,
      email: userData?.user?.email || user?.email,
    });
  };

  if (loading) return <LoadingSpinner />;

  const userInfo = [
    { label: "User ID", value: user?.sub },
    { label: "Email Verified", value: user?.email_verified ? "Yes" : "No" },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <ProfileHeader
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />
        <ProfileAvatar
          picture={userData?.user?.picture || user?.picture}
          name={userData?.user?.name || user?.name}
        />
        <ProfileForm
          isEditing={isEditing}
          user={userData?.user || user}
          editedData={editedData}
          setEditedData={setEditedData}
          userInfo={userInfo}
        />
        <ServerMessage message={userData?.message} />
      </Box>
    </Container>
  );
}

export default Profile;
