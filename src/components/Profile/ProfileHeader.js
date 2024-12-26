import React from "react";
import { useDispatch } from "react-redux";
import { Box, Typography, Button } from "@mui/material";
import { setProfileEditing } from "../../actions/profile";

const ProfileHeader = ({ isEditing }) => {
  const dispatch = useDispatch();

  const handleEditToggle = () => {
    dispatch(setProfileEditing(!isEditing));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography variant="h4">Profile</Typography>
      <Button
        variant="contained"
        color={isEditing ? "secondary" : "primary"}
        onClick={handleEditToggle}
      >
        {isEditing ? "Cancel" : "Edit Profile"}
      </Button>
    </Box>
  );
};

export default ProfileHeader;
