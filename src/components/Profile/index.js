import React, { useEffect, memo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box } from "@mui/material";
import { setProfileData } from "../../actions/profile";
import ProfileHeader from "./ProfileHeader";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ServerMessage from "./ServerMessage";
import LoadingSpinner from "./LoadingSpinner";
import { profileService } from "../../services/profileService";
import { setAuthToken } from "../../services/api";

// Memoize static components
const MemoizedProfileHeader = memo(ProfileHeader);
const MemoizedProfileAvatar = memo(ProfileAvatar);
const MemoizedServerMessage = memo(ServerMessage);

function Profile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const { isEditing, userData, loading } = useSelector(
    (state) => state.profile
  );

  const fetchUserData = async () => {
    try {
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      const data = await profileService.fetchUserData();
      dispatch(setProfileData(data));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [getAccessTokenSilently, dispatch]);

  if (loading) return <LoadingSpinner />;

  const userInfo = [
    { label: "User ID", value: user?.sub },
    { label: "Email Verified", value: user?.email_verified ? "Yes" : "No" },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <MemoizedProfileHeader isEditing={isEditing} />
        <MemoizedProfileAvatar
          picture={userData?.user?.picture || user?.picture}
          name={userData?.user?.name || user?.name}
        />
        <ProfileForm
          isEditing={isEditing}
          initialData={userData?.user || user}
          userInfo={userInfo}
        />
        <MemoizedServerMessage message={userData?.message} />
      </Box>
    </Container>
  );
}

export default Profile;
