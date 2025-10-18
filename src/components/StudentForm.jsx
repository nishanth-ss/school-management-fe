import React, { useEffect, useState } from "react";
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
import { Camera, Heading1, Trash } from "lucide-react";
import { useSnackbar } from "notistack";
import { Button } from "@/components/ui/button";
import { usePostData } from "@/hooks/usePostData";
import useFetchData from "../hooks/useFetchData";
import FaceRecognition from "./faceidcomponent/FaceId";
import { uploadFileApi } from "@/hooks/useFileImgUpload";
import DummyProfile from "@/assets/dummy.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  height: "90vh",
  overflowY: "scroll",
};

export default function StudentFormModal({ open, onClose, setOpen, onRefetch, selectedStudent, setSelectedStudent }) {
  const [profilePreview, setProfilePreview] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { data: locations } = useFetchData("location");
  const [faceIdData, setFaceIdData] = useState(null);
  const [faceidModalOpen, setFaceidModalOpen] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (selectedStudent) {
      formik.setValues(selectedStudent);
      setProfilePreview(
        selectedStudent?.pro_pic?.file_url
          ? `${BASE_URL}${selectedStudent.pro_pic.file_url.replace(/\\/g, "/")}`
          : null
      );
      formik.setFieldValue("deposite_amount", 0);
      formik.setFieldValue(
        "date_of_birth",
        selectedStudent?.date_of_birth
          ? new Date(selectedStudent.date_of_birth).toISOString().split("T")[0]
          : ""
      );
    }
  }, [selectedStudent]);

  const handleClose = () => {
    onClose();
    formik.resetForm();
    setProfilePreview(null);
  };

  const formik = useFormik({
    initialValues: {
      registration_number: "",
      student_name: "",
      father_name: "",
      mother_name: "",
      date_of_birth: "",
      gender: "",
      birth_place: "",
      nationality: "India",
      mother_tongue: "",
      blood_group: "",
      religion: "",
      deposite_amount: "",
      contact_number: "",
      class_info: {
        class_name: "",
        section: "",
        academic_year: ""
      },
    },
    validationSchema: Yup.object({
      registration_number: Yup.string().required("Registration number is required"),
      student_name: Yup.string().required("Student name is required"),
      father_name: Yup.string().required("Father name is required"),
      mother_name: Yup.string().required("Mother name is required"),
      date_of_birth: Yup.string().required("Birth date is required"),
      gender: Yup.string().required("Gender is required"),
      birth_place: Yup.string().required("Birth place is required"),
      nationality: Yup.string().required("Nationality is required"),
      mother_tongue: Yup.string().required("Mother tongue is required"),
      blood_group: Yup.string().required("Blood group is required"),
      religion: Yup.string().required("Religion is required"),
      deposite_amount: Yup.number().required("Deposit amount is required"),
      contact_number: Yup.string().required("Contact number is required"),
      class_info: Yup.object().shape({
        class_name: Yup.string().required("Class name is required"),
        section: Yup.string().required("Section is required"),
        academic_year: Yup.string().required("Academic year is required"),
      }),
    }),
    onSubmit: (values) => {
      postData(values)
    },
  });

  const handleProfileChange = async (event) => {
    const file = event.currentTarget.files[0];

    if (file) {
      // Preview image
      const reader = new FileReader();
      reader.onload = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);

      // Upload immediately
      const formData = new FormData();
      formData.append("pro_pic", file);

      try {
        const { data: uploadRes, error: uploadErr } = await uploadFileApi(formData, selectedStudent?.pro_pic?._id ? selectedStudent?.pro_pic?._id : null);

        if (uploadErr) {
          enqueueSnackbar(`Profile upload failed: ${uploadErr}`, { variant: "error" });
        } else {
          enqueueSnackbar("Profile picture uploaded successfully!", { variant: "success" });
          formik.setFieldValue("pro_pic", uploadRes?.data?.[0]?._id ?? uploadRes?.data?._id);
        }
      } catch (uploadError) {
        enqueueSnackbar(`Upload error: ${uploadError.message}`, { variant: "error" });
      }
    }
  };

  async function postData(payLoad) {
    const isEdit = !!selectedStudent;
    const url = isEdit ? `student/${selectedStudent._id}` : `student/create`;
    const method = isEdit ? "put" : "post";

    const customPayload = {
      ...payLoad,
      pro_pic: payLoad.pro_pic || "",
      location_id: locations?.[0]?._id,
      descriptor: faceIdData ? faceIdData : payLoad?.descriptor?.length > 0 ? payLoad?.descriptor : null
    };

    const { data, error } = await usePostData(url, customPayload, method);

    if (error) {
      if (error.status === 401 || error.status === 403) {
        enqueueSnackbar(error.message, { variant: 'error' });
        localStorage.clear();
        navigate("/login");
      } else {
        enqueueSnackbar(error?.message, { variant: 'error' });
      }
    } else {
      // ✅ Close modal and reset
      enqueueSnackbar(data?.message, { variant: 'success' });
      onClose();                // closes modal via parent
      formik.resetForm();       // clears form
      setProfilePreview(null);  // clears image preview
      setFaceidModalOpen(false); // close faceid modal if open
      onRefetch();
    }
  }

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
              <Avatar
                src={profilePreview || DummyProfile}
                alt="Profile Preview"
                sx={{ width: 80, height: 80, margin: "auto", mb: 1 }}
              />

              <MuiButton variant="outlined" component="label">
                Upload Profile
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleProfileChange}
                />
              </MuiButton>

              {formik.touched.pro_pic && formik.errors.pro_pic && (
                <Typography color="error" variant="caption" display="block">
                  {formik.errors.pro_pic}
                </Typography>
              )}
            </Box>

            {selectedStudent && <h1 className="py-2">{selectedStudent?.student_name} Current Balance: <span className="text-green-500 font-bold">{selectedStudent?.deposite_amount}</span></h1>}
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
                name="birth_place"
                value={formik.values.birth_place}
                onChange={formik.handleChange}
                error={formik.touched.birth_place && Boolean(formik.errors.birth_place)}
                helperText={formik.touched.birth_place && formik.errors.birth_place}
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
                name="mother_tongue"
                value={formik.values.mother_tongue}
                onChange={formik.handleChange}
                error={formik.touched.mother_tongue && Boolean(formik.errors.mother_tongue)}
                helperText={formik.touched.mother_tongue && formik.errors.mother_tongue}
              />

              <TextField
                fullWidth
                label="Blood Group"
                name="blood_group"
                value={formik.values.blood_group}
                onChange={formik.handleChange}
                error={formik.touched.blood_group && Boolean(formik.errors.blood_group)}
                helperText={formik.touched.blood_group && formik.errors.blood_group}
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
                name="contact_number"
                value={formik.values.contact_number}
                onChange={formik.handleChange}
                error={formik.touched.contact_number && Boolean(formik.errors.contact_number)}
                helperText={formik.touched.contact_number && formik.errors.contact_number}
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
                onFocus={(e) => {
                  if (formik.values.deposite_amount === 0 || formik.values.deposite_amount === "0") {
                    e.target.select(); // selects the whole value (the 0)
                  }
                }}
              />

              <TextField
                fullWidth
                label="Class Name"
                name="class_info.class_name"
                value={formik.values.class_info.class_name}
                onChange={formik.handleChange}
                error={formik.touched.class_info?.class_name && Boolean(formik.errors.class_info?.class_name)}
                helperText={formik.touched.class_info?.class_name && formik.errors.class_info?.class_name}
              />

              <TextField
                fullWidth
                label="Section"
                name="class_info.section"
                value={formik.values.class_info.section}
                onChange={formik.handleChange}
                error={formik.touched.class_info?.section && Boolean(formik.errors.class_info?.section)}
                helperText={formik.touched.class_info?.section && formik.errors.class_info?.section}
              />

              <TextField
                fullWidth
                label="Academic Year"
                name="class_info.academic_year"
                value={formik.values.class_info.academic_year}
                onChange={formik.handleChange}
                error={formik.touched.class_info?.academic_year && Boolean(formik.errors.class_info?.academic_year)}
                helperText={formik.touched.class_info?.academic_year && formik.errors.class_info?.academic_year}
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

      {faceidModalOpen && (
        <FaceRecognition mode="register" open={faceidModalOpen} setOpen={setFaceidModalOpen} faceIdData={faceIdData} setFaceIdData={setFaceIdData} />
      )}
    </Box>
  );
}
