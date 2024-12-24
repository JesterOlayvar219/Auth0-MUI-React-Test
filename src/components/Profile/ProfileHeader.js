import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

function ProfileHeader({ isEditing, onEdit, onSave, onCancel }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mb={2}
    >
      <Typography variant="h4">Profile Information</Typography>
      {!isEditing ? (
        <Button startIcon={<EditIcon />} variant="contained" onClick={onEdit}>
          Edit Profile
        </Button>
      ) : (
        <Box>
          <IconButton color="primary" onClick={onSave}>
            <SaveIcon />
          </IconButton>
          <IconButton color="error" onClick={onCancel}>
            <CancelIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default ProfileHeader;
