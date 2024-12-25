import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginRedirect = () => {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return null; // This component doesn't need to render anything
};

export default LoginRedirect;
