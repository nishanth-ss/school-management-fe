import { Edit, Search, Trash, Trash2 } from "lucide-react"
import React, { useEffect, useState } from "react"
import useFetchData from "../../hooks/useFetchData"
import { useHandleDelete } from "../../hooks/useHandleDelete"
import { Box, InputAdornment, Snackbar, TextField, IconButton } from "@mui/material"
import { useSnackbar } from "notistack"
import CommonDataGrid from "@/components/common/CustomDatagrid";
import StudentFormModal from "@/components/StudentForm";
import { Button } from "../../components/ui/button";

function InMateManageMent() {
    const { enqueueSnackbar } = useSnackbar();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [refetch, setRefetch] = useState(0)
    const [searchItem, setSearchItem] = useState();
    const [openAlert, setOpenAlert] = useState({ showAlert: false, message: '', bgColor: '' });
    const { data: studentsData } = useFetchData("student");


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

    const [searchValue, setSearchValue] = useState("");

    const handleChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleClear = () => {
        setSearchValue("");
    };

    const url = React.useMemo(() => {
        if (searchItem) {
            return `inmate/search?query=${searchItem}`;
        }
        return `inmate`;
    }, [searchItem]);

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
                            Total Student: {studentsData?.length || 0}
                        </h1>
                    </div>
                    <StudentFormModal open={isFormOpen} onClose={() => setIsFormOpen(false)} setOpen={setIsFormOpen} />

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
                <CommonDataGrid rows={
                    studentsData?.map((item, index) => ({
                        id: item._id,
                        serial: index + 1,
                        ...item,
                        class_info: item.class_info?.class_name
                            ? `${item.class_info.class_name}-${item.class_info.section}`
                            : "",
                    })) || []
                }
                    columns={columns} />
            </div>
        </div >
    )
}
export default InMateManageMent