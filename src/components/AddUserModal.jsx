import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddUserModal = ({ open, onClose, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "",
      status: "",
      joinedOn: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
      role: Yup.string().required("Role is required"),
      status: Yup.string().required("Status is required"),
      joinedOn: Yup.date().required("Join date is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New User</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <TextField
            label="Full Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
          />

          <TextField
            label="Role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
            fullWidth
          />

          <TextField
            label="Status"
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.status && Boolean(formik.errors.status)}
            helperText={formik.touched.status && formik.errors.status}
            fullWidth
          />

          <TextField
            label="Joined On"
            name="joinedOn"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formik.values.joinedOn}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.joinedOn && Boolean(formik.errors.joinedOn)}
            helperText={formik.touched.joinedOn && formik.errors.joinedOn}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserModal;
