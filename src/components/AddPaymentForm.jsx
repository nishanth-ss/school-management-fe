import React from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    MenuItem,
    Stack,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

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

export default function AddPaymentModal({ open, onClose, onSubmit }) {
    const formik = useFormik({
        initialValues: {
            studentName: "",
            rollNo: "",
            class: "",
            feeTypes: "",
            amount: "",
            date: "",
            paymentMode: "",
            remarks: "",
        },
        validationSchema: Yup.object({
            studentName: Yup.string().required("Student name is required"),
            rollNo: Yup.string().required("Roll No is required"),
            class: Yup.string().required("Class is required"),
            amount: Yup.number()
                .required("Amount is required")
                .positive("Must be a positive value"),
            date: Yup.date().required("Date is required"),
            paymentMode: Yup.string().required("Payment mode is required"),
        }),
        onSubmit: (values) => {
            onSubmit({
                id: Date.now(),
                ...values,
                status: "Paid",
                receiptNo: `RC${Math.floor(Math.random() * 10000)}`,
            });
            formik.resetForm();
            onClose();
        },
    });

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    Record Fee Payment
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Student Name"
                            name="studentName"
                            value={formik.values.studentName}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.studentName && Boolean(formik.errors.studentName)
                            }
                            helperText={
                                formik.touched.studentName && formik.errors.studentName
                            }
                            fullWidth
                        />

                        <TextField
                            label="Roll No"
                            name="rollNo"
                            value={formik.values.rollNo}
                            onChange={formik.handleChange}
                            error={formik.touched.rollNo && Boolean(formik.errors.rollNo)}
                            helperText={formik.touched.rollNo && formik.errors.rollNo}
                            fullWidth
                        />

                        <TextField
                            label="Class"
                            name="class"
                            value={formik.values.class}
                            onChange={formik.handleChange}
                            error={formik.touched.class && Boolean(formik.errors.class)}
                            helperText={formik.touched.class && formik.errors.class}
                            fullWidth
                        />

                        <TextField
                            select
                            label="Fee Type"
                            name="feeType"
                            value={formik.values.feeType}
                            onChange={formik.handleChange}
                            error={formik.touched.feeType && Boolean(formik.errors.feeType)}
                            helperText={formik.touched.feeType && formik.errors.feeType}
                            fullWidth
                        >
                            <MenuItem value="Term 1">Term 1</MenuItem>
                            <MenuItem value="Term 2">Term 2</MenuItem>
                            <MenuItem value="Term 3">Term 3</MenuItem>
                            <MenuItem value="Annual">Annual</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>

                        {/* Conditional Fields */}
                        {formik.values.feeType === "Other" && (
                            <Stack spacing={2} mt={2}>
                                <TextField
                                    label="Fee Name"
                                    name="otherFeeName"
                                    value={formik.values.otherFeeName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.otherFeeName && Boolean(formik.errors.otherFeeName)}
                                    helperText={formik.touched.otherFeeName && formik.errors.otherFeeName}
                                    fullWidth
                                />
                            </Stack>
                        )}

                        <TextField
                            label="Amount (₹)"
                            name="amount"
                            type="number"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                            helperText={formik.touched.amount && formik.errors.amount}
                            onWheel={(e) => e.target.blur()}
                            fullWidth
                        />

                        <TextField
                            label="Payment Date"
                            name="date"
                            type="date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            error={formik.touched.date && Boolean(formik.errors.date)}
                            helperText={formik.touched.date && formik.errors.date}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            select
                            label="Payment Mode"
                            name="paymentMode"
                            value={formik.values.paymentMode}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.paymentMode && Boolean(formik.errors.paymentMode)
                            }
                            helperText={
                                formik.touched.paymentMode && formik.errors.paymentMode
                            }
                            fullWidth
                        >
                            <MenuItem value="Cash">Cash</MenuItem>
                            <MenuItem value="UPI">UPI</MenuItem>
                            <MenuItem value="Card">Card</MenuItem>
                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                        </TextField>

                        <TextField
                            label="Remarks"
                            name="remarks"
                            multiline
                            rows={2}
                            value={formik.values.remarks}
                            onChange={formik.handleChange}
                            fullWidth
                        />

                        <Stack direction="row" justifyContent="flex-end" spacing={2}>
                            <Button variant="outlined" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained">
                                Save
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Box>
        </Modal>
    );
}
