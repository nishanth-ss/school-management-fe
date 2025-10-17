import React, { useState } from "react";
import {
  Box,
  Button as MuiButton,
  Modal,
  TextField,
  Typography,
  Avatar,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Camera, Trash } from "lucide-react";
import { useSnackbar } from "notistack";
import { Button } from "@/components/ui/button";
import { usePostData } from "@/hooks/usePostData";

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
  height: "90vh",
  overflowY: "scroll",
};

export default function StudentFormModal({ open, onClose, setOpen }) {
  const [profilePreview, setProfilePreview] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleClose = () => {
    onClose();
    formik.resetForm();
    setProfilePreview(null);
  };

  const formik = useFormik({
    initialValues: {
      register_number: "",
      student_name: "",
      father_name: "",
      mother_name: "",
      birth_date: "",
      gender: "",
      birth_place: "",
      nationality: "India",
      motherTongue: "",
      bloodGroup: "",
      religion: "",
      profile: null,
      deposite_amount: "",
      class_info: {
        class_name: "",
        section: "",
        academic_year: ""
      },
    },
    validationSchema: Yup.object({
      register_number: Yup.string().required("Register number is required"),
      student_name: Yup.string().required("Student name is required"),
      father_name: Yup.string().required("Father name is required"),
      mother_name: Yup.string().required("Mother name is required"),
      birth_date: Yup.string().required("Birth date is required"),
      gender: Yup.string().required("Gender is required"),
      birth_place: Yup.string().required("Birth place is required"),
      nationality: Yup.string().required("Nationality is required"),
      deposite_amount: Yup.number().required("Deposit amount is required"),
      profile: Yup.mixed().required("Profile image is required"),
      class_info: Yup.object().shape({
        class_name: Yup.string().required("Class name is required"),
        section: Yup.string().required("Section is required"),
        academic_year: Yup.string().required("Academic year is required"),
      }),
    }),
    onSubmit: (values) => {
     onSubmit(values)
    },
  });

  const handleProfileChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("profile", file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values) => {
   const {data, error} = usePostData("student", values);
   if(error){
    enqueueSnackbar(data?.data?.message, { variant: "error" });
   }else{
    enqueueSnackbar(data?.data?.message, { variant: "success" });
    handleClose();
   }
  };

  return (
    <Box>
      <MuiButton variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Student
      </MuiButton>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            Student Registration
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
                <Avatar sx={{ width: 80, height: 80, margin: "auto", mb: 1 }}>?</Avatar>
              )}
              <Button variant="outlined" component="label">
                Upload Profile
                <input hidden accept="image/*" type="file" onChange={handleProfileChange} />
              </Button>
              {formik.touched.profile && formik.errors.profile && (
                <Typography color="error" variant="caption" display="block">
                  {formik.errors.profile}
                </Typography>
              )}
            </Box>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <TextField
                fullWidth
                label="Registration Number"
                name="registration_number"
                value={formik.values.registration_number}
                onChange={formik.handleChange}
                error={formik.touched.registration_number && Boolean(formik.errors.registration_number)}
                helperText={formik.touched.registration_number && formik.errors.registration_number}
              />

              <TextField
                fullWidth
                label="Student Name"
                name="student_name"
                value={formik.values.student_name}
                onChange={formik.handleChange}
                error={formik.touched.student_name && Boolean(formik.errors.student_name)}
                helperText={formik.touched.student_name && formik.errors.student_name}
              />

              <TextField
                fullWidth
                label="Father Name"
                name="father_name"
                value={formik.values.father_name}
                onChange={formik.handleChange}
                error={formik.touched.father_name && Boolean(formik.errors.father_name)}
                helperText={formik.touched.father_name && formik.errors.father_name}
              />

              <TextField
                fullWidth
                label="Mother Name"
                name="mother_name"
                value={formik.values.mother_name}
                onChange={formik.handleChange}
                error={formik.touched.mother_name && Boolean(formik.errors.mother_name)}
                helperText={formik.touched.mother_name && formik.errors.mother_name}
              />

              <TextField
                fullWidth
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.date_of_birth}
                onChange={formik.handleChange}
                error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
              />

              <TextField
                select
                fullWidth
                label="Gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Birth Place"
                name="birthPlace"
                value={formik.values.birthPlace}
                onChange={formik.handleChange}
                error={formik.touched.birthPlace && Boolean(formik.errors.birthPlace)}
                helperText={formik.touched.birthPlace && formik.errors.birthPlace}
              />

              <TextField
                fullWidth
                label="Nationality"
                name="nationality"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                error={formik.touched.nationality && Boolean(formik.errors.nationality)}
                helperText={formik.touched.nationality && formik.errors.nationality}
              />

              <TextField
                fullWidth
                label="Mother Tongue"
                name="motherTongue"
                value={formik.values.motherTongue}
                onChange={formik.handleChange}
                error={formik.touched.motherTongue && Boolean(formik.errors.motherTongue)}
                helperText={formik.touched.motherTongue && formik.errors.motherTongue}
              />

              <TextField
                fullWidth
                label="Blood Group"
                name="bloodGroup"
                value={formik.values.bloodGroup}
                onChange={formik.handleChange}
                error={formik.touched.bloodGroup && Boolean(formik.errors.bloodGroup)}
                helperText={formik.touched.bloodGroup && formik.errors.bloodGroup}
              />

              <TextField
                fullWidth
                label="Religion"
                name="religion"
                value={formik.values.religion}
                onChange={formik.handleChange}
                error={formik.touched.religion && Boolean(formik.errors.religion)}
                helperText={formik.touched.religion && formik.errors.religion}
              />

              <TextField
                fullWidth
                label="Contact Number"
                name="contact"
                value={formik.values.contact}
                onChange={formik.handleChange}
                error={formik.touched.contact && Boolean(formik.errors.contact)}
                helperText={formik.touched.contact && formik.errors.contact}
              />

              <TextField
                fullWidth
                label="Deposit Amount (₹)"
                name="deposite_amount"
                type="number"
                onWheel={(e) => e.target.blur()}
                value={formik.values.deposite_amount}
                onChange={formik.handleChange}
                error={formik.touched.deposite_amount && Boolean(formik.errors.deposite_amount)}
                helperText={formik.touched.deposite_amount && formik.errors.deposite_amount}
              />
            </div>

            {/* Face ID and Buttons */}
            <Box mt={3} display="flex" flexDirection="column" gap={2}>

              {/* Face ID Button */}
              <div className="grid grid-cols-[80%_20%] gap-2">
                <Button type="button" onClick={() => setFaceidModalOpen(true)} className="bg-gray-500 text-white w-full">
                  <Camera />
                  {selectedStudent?.user_id?.descriptor?.length > 0 ? "Update Face ID" : "Register Face ID"}
                </Button>
                <Button type="button" disabled={!selectedStudent?.user_id?.descriptor || selectedStudent?.user_id?.descriptor?.length === 0} onClick={() => deleteFaceId(selectedStudent?.user_id?._id)} className="bg-red-500 hover:bg-red-600 text-white w-full">
                  <Trash />
                </Button>
              </div>

              <Box display="flex" justifyContent="end" gap={1}>
                <MuiButton type="button" variant="outlined" color="error" onClick={handleClose}>
                  Cancel
                </MuiButton>
                <MuiButton type="submit" variant="contained">
                  Submit
                </MuiButton>
              </Box>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
