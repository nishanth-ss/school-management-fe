import { Edit, Search, Trash, Trash2 } from "lucide-react"
import React, { useEffect, useState } from "react"
import useFetchData from "../../hooks/useFetchData"
import { useHandleDelete } from "../../hooks/useHandleDelete"
import { Box, InputAdornment, Snackbar, TextField, IconButton } from "@mui/material"
import { useSnackbar } from "notistack"
import CommonDataGrid from "@/components/common/CustomDatagrid";
import StudentFormModal from "@/components/StudentForm";
import { Button } from "../../components/ui/button";
import { Clear } from "@mui/icons-material"
import { useDebounce } from "@/utilis/useDebounce"

function InMateManageMent() {
    const { enqueueSnackbar } = useSnackbar();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [refetch, setRefetch] = useState(0)
    const [searchItem, setSearchItem] = useState();
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebounce(searchValue, 500);
    const [openAlert, setOpenAlert] = useState({ showAlert: false, message: '', bgColor: '' });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { data: students } = useFetchData(
        `student?search=${debouncedSearchValue || ""}&page=${page + 1}&limit=${rowsPerPage}`,
        refetch,
        "true"
    );
    const studentsData = students?.data;
    const totalRecords = students?.totalItems || 0;

    const columns = [
        { field: "serial", headerName: "S.NO", flex: 0.5 },
        { field: "registration_number", headerName: "Register Number", flex: 1 },
        { field: "student_name", headerName: "Student Name", flex: 1 },
        { field: "class_info", headerName: "Class", flex: 1 },
        { field: "deposite_amount", headerName: "Deposit Amount", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <div className="flex justify-center items-center h-full gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            setIsFormOpen(true);
                            setSelectedStudent(studentsData?.find((item) => item._id === params.row._id))
                        }}
                    >
                        <Edit className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            deleteItem(params.row?._id)
                        }}
                    >
                        <Trash2 className="w-4 h-4 text-gray-600" />
                    </Button>
                </div>
            ),
        },
    ];

    const handleChange = (e) => {
        setSearchValue(e.target.value); // debounced value updates API after 500ms
    };

    const handleClear = () => {
        setSearchValue(""); // triggers API to fetch all data
        setPage(0);
    };

    const url = React.useMemo(() => {
        if (debouncedSearchValue) {
            return `student/search?query=${debouncedSearchValue}&page=${page + 1}&limit=${rowsPerPage}`;
        }
        return `student?page=${page + 1}&limit=${rowsPerPage}`;
    }, [debouncedSearchValue]);

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

    useEffect(() => {
        setTimeout(() => setOpenAlert({ showAlert: false, message: '', bgColor: '' }), 5000)
    }, [refetch, openAlert]);

    const handleRefetch = () => setRefetch(prev => prev + 1);

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
                            Total Student: {totalRecords || 0}
                        </h1>
                    </div>
                    <StudentFormModal
                        open={isFormOpen}
                        onClose={() => { setIsFormOpen(false), setSelectedStudent(null) }}
                        setOpen={setIsFormOpen}
                        onRefetch={handleRefetch}
                        selectedStudent={selectedStudent}
                        setSelectedStudent={setSelectedStudent}
                    />
                </div>

                <div className="flex flex-col w-full md:w-[30rem] md:flex-row md:items-center justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
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
                <CommonDataGrid
                    rows={Array.isArray(studentsData) ? studentsData?.map((item, index) => ({
                        id: item._id,
                        serial: index + 1,
                        ...item,
                        class_info: item.class_info?.class_name
                            ? `${item.class_info.class_name}-${item.class_info.section}`
                            : "",
                    })) || [] : []}
                    columns={columns}
                    totalRecords={totalRecords || 0}
                    page={page}
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newSize) => {
                        setRowsPerPage(newSize);
                        setPage(0); // reset to first page when pageSize changes
                    }}
                    pageSize={rowsPerPage}
                />
            </div>
        </div >
    )
}
export default InMateManageMent