import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Profile from "./components/Profile";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Auth0Sync from "./components/common/Auth0Sync";
import LoginRedirect from "./components/common/LoginRedirect";

const App = () => {
  return (
    <>
      <Auth0Sync />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRedirect />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
