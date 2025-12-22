import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { usePostData } from "@/hooks/usePostData";

const CampusDialog = ({ open, onClose, campus, page, rowsPerPage, setRefetch }) => {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        baseUrl: "",
        amount: ""
    });


    useEffect(() => {
        if (campus) {
            setFormData({
                name: campus.name || "",
                location: campus.location || "",
                baseUrl: campus.baseUrl || "",
                amount: campus?.amount || ""
            });
        }
    }, [campus]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        console.log("Submitted Data:", formData);
        const url = `location/admin/${campus?._id}`
        const { data, error } = await usePostData(url, formData);
        if (!error && data.status) {
            onClose();
            enqueueSnackbar("campus location updated successfully", { variant: "success" });
            setRefetch(prev => prev + 1);
            formik.resetForm({
                name: "",
                location: "",
                baseUrl: "",
                amount: ""
            });
        } else {
            enqueueSnackbar("Failed to update", { variant: "error" });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Campus Details</DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Campus Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Base URL"
                        name="baseUrl"
                        value={formData.baseUrl}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        fullWidth
                        onWheel={(e) => e.target.blur()}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CampusDialog;
