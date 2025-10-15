import { Search } from "lucide-react"
import React, { useEffect, useState } from "react"
import useFetchData from "../../hooks/useFetchData"
import { useHandleDelete } from "../../hooks/useHandleDelete"
import { Box, Button, InputAdornment, Snackbar, Stack, TextField, IconButton } from "@mui/material"
import { useSnackbar } from "notistack"
import CommonDataGrid from "@/components/common/CustomDatagrid";
import StudentFormModal from "@/components/StudentForm";

const rows = [
    { id: 1, name: "Arjun Kumar", rollNo: "S001", class: "10A", age: 15, contact: "9876543210" },
    { id: 2, name: "Priya Sharma", rollNo: "S002", class: "10B", age: 14, contact: "9876543211" },
    { id: 3, name: "Ravi Singh", rollNo: "S003", class: "9A", age: 13, contact: "9876543212" },
];

const columns = [
    { field: "id", headerName: "S.NO", flex: 0.5 },
    { field: "name", headerName: "Student Name", flex: 1 },
    { field: "rollNo", headerName: "Roll No", flex: 1 },
    { field: "class", headerName: "Class", flex: 1 },
    { field: "age", headerName: "Age", flex: 1 },
    { field: "contact", headerName: "Contact No", flex: 1 },
    {
        field: "actions",
        headerName: "Actions",
         flex: 1,
        sortable: false,
        renderCell: (params) => (
            <Stack direction="row" spacing={1} >
                <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => alert(`View ${params.row.name}`)}
                >
                    View
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => alert(`Delete ${params.row.name}`)}
                >
                    Delete
                </Button>
            </Stack>
        ),
    },
];

function InMateManageMent() {
    const { enqueueSnackbar } = useSnackbar();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedInmate, setSelectedInmate] = useState(null);
    const [refetch, setRefetch] = useState(0)
    const [searchItem, setSearchItem] = useState();
    const [openAlert, setOpenAlert] = useState({ showAlert: false, message: '', bgColor: '' })

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("inmateId");
    const [searchValue, setSearchValue] = useState("");

    const handleChange = (e) => {
        setSearchValue(e.target.value);
        if (onSearch) onSearch(e.target.value); // Optional: pass value to parent
    };

    const handleClear = () => {
        setSearchValue("");
        if (onSearch) onSearch("");
    };

    const url = React.useMemo(() => {
        if (searchItem) {
            return `inmate/search?query=${searchItem}&page=${page + 1}&limit=${rowsPerPage}`;
        }
        return `inmate?sortField=${orderBy}&sortOrder=${order}&page=${page + 1}&limit=${rowsPerPage}`;
    }, [searchItem, page, rowsPerPage, order, orderBy]);

    const { data, error } = useFetchData(url, refetch, "logs");
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "dsc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (
        event,
        newPage,
    ) => {
        setPage(newPage);
        setRefetch(refetch + 1)
    };

    const handleChangeRowsPerPage = (
        event,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setRefetch(refetch + 1)
    };

    async function deleteItem(id) {
        const { data, error } = await useHandleDelete(`inmate/${id}`);
        if (error) {
            enqueueSnackbar(data?.data?.message, {
                variant: 'error',
            });
        } else {
            enqueueSnackbar(data?.data?.message, {
                variant: 'success',
            });
            setTimeout(() => setRefetch((prev) => prev + 1), 200);
        }
    }

    const handleAdd = () => {
        setSelectedInmate(null);
        setIsFormOpen(true);
    };

    useEffect(() => {
        setTimeout(() => setOpenAlert({ showAlert: false, message: '', bgColor: '' }), 5000)
    }, [refetch, openAlert])

    return (

        <div className="w-full">

            <Box sx={{ width: 500, bgcolor: 'red' }}>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openAlert?.message}
                    message={openAlert?.message}
                    autoHideDuration={2000}
                    ContentProps={{
                        sx: {
                            backgroundColor: openAlert?.bgColor,
                            color: '#fff',
                        }
                    }}
                    key={'topcenter'}
                />
            </Box>

            <div className="p-6 max-w-8xl mx-auto min-h-screen bg-gray-50">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex space-x-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
                            <p className="text-gray-600">Manage Student profiles and demographics</p>
                        </div>
                        <h1 className="text-xl flex items-center font-semibold h-[40px] text-blue-600 bg-blue-100 px-3 py-1 rounded-md shadow-sm">
                            Total Student: {rows.length || 0}
                        </h1>
                    </div>
                    <StudentFormModal />

                </div>

                <div className="flex flex-col w-full md:w-[50%] md:flex-row md:items-center justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
                    {/* Search Bar */}
                    <TextField
                        value={searchValue}
                        onChange={handleChange}
                        placeholder="Search..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: searchValue && (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClear} size="small">
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>


                {/* Table */}

                <CommonDataGrid rows={rows} columns={columns} />;
            </div>
        </div >
    )
}
export default InMateManageMent