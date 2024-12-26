import {
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  SET_PROFILE_DATA,
  SET_PROFILE_EDITING,
} from "./types";
import { profileService } from "../services/profileService";

export const setProfileData = (data) => ({
  type: SET_PROFILE_DATA,
  payload: data,
});

export const updateProfile = (profileData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });

  try {
    const data = await profileService.updateUserProfile(profileData);
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

export const setProfileEditing = (isEditing) => ({
  type: SET_PROFILE_EDITING,
  payload: isEditing,
});
