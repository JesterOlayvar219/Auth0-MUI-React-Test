import React, { memo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProfile, setProfileEditing } from "../../actions/profile";
import { TextField, Button, Grid } from "@mui/material";

const ProfileForm = memo(({ isEditing, initialData, userInfo }) => {
  const [formData, setFormData] = useState(initialData);
  const dispatch = useDispatch();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData));
      dispatch(setProfileEditing(false)); // Disable edit mode after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    return name.trim().length >= 2; // Minimum 2 characters
  };

  // Error states
  const nameError =
    isEditing && !validateName(formData.name)
      ? "Name must be at least 2 characters long"
      : "";

  const emailError =
    isEditing && !validateEmail(formData.email)
      ? "Please enter a valid email address"
      : "";

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Read-only fields */}
        {userInfo.map(({ label, value }) => (
          <Grid item xs={12} key={label}>
            <TextField fullWidth label={label} value={value || ""} disabled />
          </Grid>
        ))}

        {/* Editable fields */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            value={formData?.name || ""}
            onChange={handleChange("name")}
            disabled={!isEditing}
            error={!!nameError}
            helperText={nameError}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            value={formData?.email || ""}
            onChange={handleChange("email")}
            disabled={!isEditing}
            error={!!emailError}
            helperText={emailError}
          />
        </Grid>

        {/* Save button only shows when editing */}
        {isEditing && (
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Changes
            </Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
});

export default ProfileForm;
