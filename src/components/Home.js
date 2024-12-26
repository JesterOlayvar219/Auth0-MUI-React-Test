import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "./dashboard";

const Home = () => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: "center" }}>
        {!isAuthenticated ? (
          <Button variant="contained" size="large" onClick={loginWithRedirect}>
            Login
          </Button>
        ) : (
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome, {user.name}
            </Typography>
            <Dashboard />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Home;
