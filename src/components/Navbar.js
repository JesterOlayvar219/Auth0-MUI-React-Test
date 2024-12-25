import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../actions/auth";
import { connect } from "react-redux";

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { logout: auth0Logout } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    auth0Logout({
      logoutParams: {
        returnTo: "https://localhost:5000",
      },
    });
  };

  return (
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
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default connect(null, { logout })(Navbar);
