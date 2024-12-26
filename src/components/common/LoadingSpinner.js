import React from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = ({ size = 24 }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default LoadingSpinner;
