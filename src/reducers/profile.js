import {
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  SET_PROFILE_EDITING,
  SET_PROFILE_DATA,
} from "../actions/types";

const initialState = {
  isEditing: false,
  loading: false,
  error: null,
  userData: null,
  editedData: {
    name: "",
    email: "",
  },
};

export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PROFILE_EDITING:
      return {
        ...state,
        isEditing: action.payload,
      };

    case SET_PROFILE_DATA:
      return {
        ...state,
        userData: action.payload,
        editedData: {
          name: action.payload?.user?.name || "",
          email: action.payload?.user?.email || "",
        },
      };

    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        userData: action.payload,
        editedData: {
          name: action.payload.user.name,
          email: action.payload.user.email,
        },
      };

    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
