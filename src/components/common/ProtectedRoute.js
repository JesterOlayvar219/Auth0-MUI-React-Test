import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../Profile/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: window.location.pathname },
    });
    return null;
  }

  return children;
};

export default ProtectedRoute;
