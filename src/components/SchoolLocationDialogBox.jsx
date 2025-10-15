import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { usePostData } from "../hooks/usePostData";

export default function SchoolLocationDialogBox({
  open,
  setOpen,
  selectedLocation,
  setRefetch,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      schoolName: "",
      branchName: "",
      address: "",
      city: "",
      state: "",
      contactNumber: "",
    },
    validationSchema: Yup.object({
      schoolName: Yup.string().required("School name is required"),
      branchName: Yup.string().required("Branch name is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      contactNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Must be a valid 10-digit number")
        .required("Contact number is required"),
    }),
    onSubmit: async (values) => {
      const isEdit = Object.keys(selectedLocation ?? {}).length > 0;
      const url = isEdit
        ? `school-location/${selectedLocation._id}`
        : `school-location`;
      const method = isEdit ? "put" : "post";

      const { data, error } = await usePostData(url, values, method);

      if (error) {
        enqueueSnackbar(error?.message || "Something went wrong", {
          variant: "error",
        });
      } else {
        enqueueSnackbar(
          isEdit
            ? "School location updated successfully!"
            : "School location added successfully!",
          { variant: "success" }
        );
        setOpen(false);
        setRefetch((prev) => prev + 1);
        formik.resetForm();
      }
    },
  });

  useEffect(() => {
    if (open && selectedLocation) {
      formik.setValues({
        schoolName: selectedLocation?.schoolName || "",
        branchName: selectedLocation?.branchName || "",
        address: selectedLocation?.address || "",
        city: selectedLocation?.city || "",
        state: selectedLocation?.state || "",
        contactNumber: selectedLocation?.contactNumber || "",
      });
    }
  }, [open, selectedLocation]);

  const isEdit = Object.keys(selectedLocation ?? {}).length > 0;

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? "Edit School Location" : "Add School Location"}
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* School Name */}
            <TextField
              label="School Name"
              name="schoolName"
              value={formik.values.schoolName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.schoolName && Boolean(formik.errors.schoolName)
              }
              helperText={
                formik.touched.schoolName && formik.errors.schoolName
              }
              fullWidth
            />

            {/* Branch Name */}
            <TextField
              label="Branch Name"
              name="branchName"
              value={formik.values.branchName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.branchName && Boolean(formik.errors.branchName)
              }
              helperText={
                formik.touched.branchName && formik.errors.branchName
              }
              fullWidth
            />

            {/* Address (takes full width) */}
            <div className="">
              <TextField
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.address && Boolean(formik.errors.address)
                }
                helperText={formik.touched.address && formik.errors.address}
                fullWidth
                multiline
                rows={2}
              />
            </div>

            {/* City */}
            <TextField
              label="City"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
              fullWidth
            />

            {/* State */}
            <TextField
              label="State"
              name="state"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
              fullWidth
            />

            {/* Contact Number (full width) */}
            <div className="">
              <TextField
                label="Contact Number"
                name="contactNumber"
                value={formik.values.contactNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.contactNumber &&
                  Boolean(formik.errors.contactNumber)
                }
                helperText={
                  formik.touched.contactNumber && formik.errors.contactNumber
                }
                fullWidth
                inputProps={{ maxLength: 10 }}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              formik.resetForm();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
