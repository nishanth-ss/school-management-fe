import React, { useState } from "react";
import AddPaymentModal from "@/components/AddPaymentForm";
import CommonDataGrid from "@/components/common/CustomDatagrid";
import { Button } from "@mui/material";

const data = [
  {
    id: 1,
    studentName: "Arjun Kumar",
    rollNo: "S001",
    class: "10A",
    amount: 2500,
    feeType: "Tuition",
    date: "2025-10-10",
    status: "Paid", // or "Due"
    paymentMode: "Cash",
    receiptNo: "RC001",
  },
];

export default function FeesManagement() {
  const [feesData, setFeesData] = useState(data);
  const [openModal, setOpenModal] = useState(false);

  const handleAddPayment = (newPayment) => {
    setFeesData((prev) => [...prev, newPayment]);
  };

  const handleCloseModal = () => setOpenModal(false);

  const columns = [
    { field: "studentName", headerName: "Student", flex: 1 },
    { field: "rollNo", headerName: "Roll No", flex: 1 },
    { field: "class", headerName: "Class", flex: 1 },
    { field: "feeType", headerName: "Fee Type", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "paymentMode", headerName: "Mode", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
  ];


  return (
    <div className="w-full">
      <div className="p-6 mx-auto min-h-screen bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fees Management</h1>
            <p className="text-gray-600 mb-6">Manage student fee payments and records</p>
          </div>
          <Button variant="contained" onClick={()=>setOpenModal(true)}>Add Payment</Button>
        </div>
        <CommonDataGrid rows={feesData} columns={columns} />
      </div>
      <AddPaymentModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleAddPayment}
      />
    </div>
  );
}


// <Box>
{/* <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpenModal(true)}>
        Add Payment
      </Button>

      <CommonDataGrid rows={feesData} columns={columns} />

      <AddPaymentModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleAddPayment}

              
      /> */}

{/* </Box> */ }