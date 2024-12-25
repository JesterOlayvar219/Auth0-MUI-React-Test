import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: null,
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: payload,
      };

    case LOGIN_FAIL:
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    default:
      return state;
  }
}
