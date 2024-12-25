import {
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  SET_PROFILE_EDITING,
  SET_PROFILE_DATA,
} from "./types";

export const setProfileEditing = (isEditing) => ({
  type: SET_PROFILE_EDITING,
  payload: isEditing,
});

export const setProfileData = (data) => ({
  type: SET_PROFILE_DATA,
  payload: data,
});

export const updateProfile = (profileData, accessToken) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });

  try {
    const response = await fetch("http://localhost:3000/api/data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};
