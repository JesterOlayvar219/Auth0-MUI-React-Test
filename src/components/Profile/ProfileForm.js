import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";

function ProfileForm({ isEditing, user, editedData, setEditedData, userInfo }) {
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
    isEditing && !validateName(editedData.name)
      ? "Name must be at least 2 characters long"
      : "";

  const emailError =
    isEditing && !validateEmail(editedData.email)
      ? "Please enter a valid email address"
      : "";

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              component="th"
              scope="row"
              sx={{ width: "30%", fontWeight: "bold" }}
            >
              Name
            </TableCell>
            <TableCell>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={editedData.name}
                  onChange={(e) =>
                    setEditedData({ ...editedData, name: e.target.value })
                  }
                  error={!!nameError}
                  helperText={nameError}
                  required
                />
              ) : (
                user?.name
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              component="th"
              scope="row"
              sx={{ width: "30%", fontWeight: "bold" }}
            >
              Email
            </TableCell>
            <TableCell>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={editedData.email}
                  onChange={(e) =>
                    setEditedData({ ...editedData, email: e.target.value })
                  }
                  error={!!emailError}
                  helperText={emailError}
                  required
                  type="email"
                />
              ) : (
                user?.email
              )}
            </TableCell>
          </TableRow>
          {userInfo.map(
            (row) =>
              row.value && (
                <TableRow key={row.label}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ width: "30%", fontWeight: "bold" }}
                  >
                    {row.label}
                  </TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProfileForm;
