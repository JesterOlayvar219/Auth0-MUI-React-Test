import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "./types";

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFail = () => ({
  type: LOGIN_FAIL,
});

export const logout = () => (dispatch) => {
  // Clear any auth tokens from localStorage
  localStorage.removeItem("user");

  dispatch({
    type: LOGOUT,
  });
};
