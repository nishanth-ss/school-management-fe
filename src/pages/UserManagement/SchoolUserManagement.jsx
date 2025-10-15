import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import AddUserModal from "@/components/AddUserModal";

const SchoolUserManagement = () => {

    const [openModal, setOpenModal] = useState(false);
    // 🧩 Columns for the user management table
    const columns = [
        { field: "id", headerName: "ID", flex: 0.4 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1.2 },
        { field: "role", headerName: "Role", flex: 0.8 },
        { field: "status", headerName: "Status", flex: 0.7 },
        { field: "joinedOn", headerName: "Joined On", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <div className="flex space-x-2">
                    <Button size="small" variant="outlined">
                        Edit
                    </Button>
                    <Button size="small" color="error" variant="outlined">
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    // 🧾 Sample data (you can later fetch from API)
    const [rows, setRows] = useState([
        {
            id: 1,
            name: "Arjun Kumar",
            email: "arjun.kumar@school.edu",
            role: "Teacher",
            status: "Active",
            joinedOn: "2023-07-10",
        },
        {
            id: 2,
            name: "Priya Sharma",
            email: "priya.sharma@school.edu",
            role: "Admin",
            status: "Active",
            joinedOn: "2022-11-23",
        },
        {
            id: 3,
            name: "Ravi Singh",
            email: "ravi.singh@school.edu",
            role: "Student",
            status: "Inactive",
            joinedOn: "2024-02-15",
        },
    ]);

    const handleAddUser = (newUser) => {
        setRows((prev) => [...prev, { id: prev.length + 1, ...newUser }]);
    };

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 text-sm">Monitor Users</p>
                </div>
                <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                    + Add User
                </Button>
            </div>

            <Box sx={{ height: 450, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableRowSelectionOnClick
                    sx={{
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f5f5f5",
                            fontWeight: "bold",
                        },
                    }}
                />
            </Box>


            <AddUserModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={handleAddUser}
            />
        </div>
    );
};

export default SchoolUserManagement;
