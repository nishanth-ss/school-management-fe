import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import FaceRecognition from "./faceidcomponent/FaceId";
import { Camera, Trash } from "lucide-react";
import { useSnackbar } from "notistack";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function StudentFormModal() {
  const [open, setOpen] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [faceidModalOpen, setFaceidModalOpen] = useState(false);
  const [faceIdData, setFaceIdData] = useState(null);
  const [selectedInmate, setSelectedInmate] = useState({});
  const [refetch, setRefetch] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setProfilePreview(null);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      rollNo: "",
      class: "",
      age: "",
      contact: "",
      profile: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      rollNo: Yup.string().required("Roll number is required"),
      class: Yup.string().required("Class is required"),
      age: Yup.number()
        .required("Age is required")
        .min(5, "Too young")
        .max(20, "Too old"),
      contact: Yup.string()
        .matches(/^[0-9]{10}$/, "Must be a valid 10-digit number")
        .required("Contact is required"),
      profile: Yup.mixed().required("Profile image is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Data:", values);
      alert("Student added successfully!");
      handleClose();
    },
  });

  const handleProfileChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("profile", file);

    // Preview image
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  async function deleteFaceId(id) {

    const { data, error } = await useHandleDelete(`faceRecognition/delete/${id}`);
    if (error) {
      enqueueSnackbar(data?.data?.message, {
        variant: 'error',
      });

    } else {
      enqueueSnackbar(data?.data?.message, {
        variant: 'success',
      });
      setTimeout(() => setRefetch((prev) => prev + 1), 100);
      setSelectedInmate({ ...selectedInmate, user_id: { ...selectedInmate.user_id, descriptor: [] } });
    }
  }

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Student
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            Add Student Details
          </Typography>
          <form onSubmit={formik.handleSubmit}>

            {/* Profile Upload */}
            <Box mt={2} textAlign="center">
              {profilePreview ? (
                <Avatar
                  src={profilePreview}
                  alt="Profile Preview"
                  sx={{ width: 80, height: 80, margin: "auto", mb: 1 }}
                />
              ) : (
                <Avatar sx={{ width: 80, height: 80, margin: "auto", mb: 1 }}>
                  ?
                </Avatar>
              )}

              <Button variant="outlined" component="label">
                Upload Profile
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleProfileChange}
                />
              </Button>
              {formik.touched.profile && formik.errors.profile && (
                <Typography color="error" variant="caption" display="block">
                  {formik.errors.profile}
                </Typography>
              )}
            </Box>

            {/* Grid for Two Inputs per Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />

              <TextField
                fullWidth
                label="Roll No"
                name="rollNo"
                value={formik.values.rollNo}
                onChange={formik.handleChange}
                error={formik.touched.rollNo && Boolean(formik.errors.rollNo)}
                helperText={formik.touched.rollNo && formik.errors.rollNo}
              />

              <TextField
                fullWidth
                label="Father's Name"
                name="fatherName"
                value={formik.values.fatherName}
                onChange={formik.handleChange}
                error={formik.touched.fatherName && Boolean(formik.errors.fatherName)}
                helperText={formik.touched.fatherName && formik.errors.fatherName}
              />

              <TextField
                fullWidth
                label="Mother's Name"
                name="motherName"
                value={formik.values.motherName}
                onChange={formik.handleChange}
                error={formik.touched.motherName && Boolean(formik.errors.motherName)}
                helperText={formik.touched.motherName && formik.errors.motherName}
              />

              <TextField
                fullWidth
                label="Annual Fees (₹)"
                name="annualFees"
                type="number"
                 onWheel={(e) => e.target.blur()}
                value={formik.values.annualFees}
                onChange={formik.handleChange}
                error={formik.touched.annualFees && Boolean(formik.errors.annualFees)}
                helperText={formik.touched.annualFees && formik.errors.annualFees}
              />

              <TextField
                fullWidth
                label="Class"
                name="class"
                value={formik.values.class}
                onChange={formik.handleChange}
                error={formik.touched.class && Boolean(formik.errors.class)}
                helperText={formik.touched.class && formik.errors.class}
              />

              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formik.values.age}
                onChange={formik.handleChange}
                error={formik.touched.age && Boolean(formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
              />

              <TextField
                fullWidth
                label="Contact"
                name="contact"
                value={formik.values.contact}
                onChange={formik.handleChange}
                error={formik.touched.contact && Boolean(formik.errors.contact)}
                helperText={formik.touched.contact && formik.errors.contact}
              />
            </div>

            {/* Face ID and Submit Button */}
            <div className="grid grid-cols-1 gap-2 mt-4">
              <Button
                type="button"
                onClick={() => setFaceidModalOpen(true)}
                className="!bg-gray-500 !text-white w-full !flex !justify-center gap-2 h-full !items-center !hover:bg-gray-600"
              >
                <Camera />
                {selectedInmate?.user_id?.descriptor?.length > 0
                  ? "Update Face ID"
                  : "Register Face ID"}
              </Button>
            </div>

            <Box mt={3} textAlign="center">
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
