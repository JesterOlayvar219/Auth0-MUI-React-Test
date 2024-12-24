import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "./dashboard";
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Link, useNavigate, Routes, Route } from "react-router-dom";

import Profile from "./components/Profile";

const App = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
            Auth0 App
          </Typography>
          {isAuthenticated && (
            <>
              <Button color="inherit" onClick={() => navigate("/profile")}>
                Profile
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                color="inherit"
                onClick={() => logout({ returnTo: "https://localhost:5000" })}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route
          path="/"
          element={
            <Container maxWidth="lg">
              <Box sx={{ mt: 4, textAlign: "center" }}>
                {!isAuthenticated ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={loginWithRedirect}
                  >
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
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default App;
