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
