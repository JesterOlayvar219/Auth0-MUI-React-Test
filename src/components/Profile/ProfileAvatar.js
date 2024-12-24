import React from "react";
import { Box, Avatar } from "@mui/material";

function ProfileAvatar({ picture, name }) {
  return (
    <Box display="flex" justifyContent="center" mb={4}>
      <Avatar src={picture} alt={name} sx={{ width: 120, height: 120 }} />
    </Box>
  );
}

export default ProfileAvatar;
