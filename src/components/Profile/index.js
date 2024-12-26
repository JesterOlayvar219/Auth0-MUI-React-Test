import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box } from "@mui/material";
import {
  setProfileEditing,
  setProfileData,
  updateProfile,
} from "../../actions/profile";
import ProfileHeader from "./ProfileHeader";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ServerMessage from "./ServerMessage";
import LoadingSpinner from "./LoadingSpinner";

function Profile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const { isEditing, userData, editedData, loading } = useSelector(
    (state) => state.profile
  );

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/data", {
        headers: {
          Authorization: `Bearer ${await getAccessTokenSilently()}`,
        },
      });
      const data = await response.json();
      dispatch(setProfileData(data));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(
    () => {
      fetchUserData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getAccessTokenSilently, dispatch]
  );

  const handleEdit = () => {
    dispatch(setProfileEditing(true));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateProfile(editedData, await getAccessTokenSilently()));
      dispatch(setProfileEditing(false));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    dispatch(setProfileEditing(false));
  };

  const handleFormChange = (newData) => {
    dispatch(setProfileData({ ...userData, user: newData }));
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
          setEditedData={handleFormChange}
          userInfo={userInfo}
        />
        <ServerMessage message={userData?.message} />
      </Box>
    </Container>
  );
}

export default Profile;
