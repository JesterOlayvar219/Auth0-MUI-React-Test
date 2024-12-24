import React from "react";
import { Box, Typography, Paper } from "@mui/material";

function ServerMessage({ message }) {
  if (!message) return null;

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        Server Message
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>{message}</Typography>
      </Paper>
    </Box>
  );
}

export default ServerMessage;
