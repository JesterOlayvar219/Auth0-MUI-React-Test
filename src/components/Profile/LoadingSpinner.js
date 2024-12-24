import React from "react";
import { Box, CircularProgress } from "@mui/material";

function LoadingSpinner() {
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

export default LoadingSpinner;
