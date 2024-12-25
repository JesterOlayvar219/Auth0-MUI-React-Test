import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFail } from "../../actions/auth";

const Auth0Sync = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log("Auth0 user data:", user);
        dispatch(
          loginSuccess({
            ...user,
            email: user.email,
            name: user.name,
            picture: user.picture,
          })
        );
      } else {
        dispatch(loginFail());
      }
    }
  }, [isAuthenticated, user, isLoading, dispatch]);

  return null;
};

export default Auth0Sync;
