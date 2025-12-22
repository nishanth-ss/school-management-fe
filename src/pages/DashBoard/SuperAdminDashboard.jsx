import useFetchData from "@/hooks/useFetchData";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { TablePagination } from "@mui/material";
import { ArrowBack, ArrowBackIosNew, ArrowBackOutlined } from "@mui/icons-material";
import { set } from "date-fns";
import { Edit } from "lucide-react";
import CampusDialog from "@/components/SuperAdminDialogBox";

// const getSubscriptionColor = (status) => {
//   switch (status) {
//     case "active":
//       return "success";
//     case "expired":
//       return "error";
//     case "trial":
//       return "warning";
//     default:
//       return "default";
//   }
// };

function StatCard({ title, value = 0, icon, accent = "indigo" }) {
  const formatted =
    typeof value === "number"
      ? value >= 1000
        ? `${(value / 1000).toFixed(1)}k`
        : value.toString()
      : value;

  const accentFrom = {
    indigo: "from-indigo-500",
    green: "from-green-500",
    rose: "from-rose-500",
  }[accent];

  const accentTo = {
    indigo: "to-indigo-400",
    green: "to-green-400",
    rose: "to-rose-400",
  }[accent];

  return (
    <div className="rounded-2xl shadow-sm p-6 bg-white flex items-center gap-4 transform transition hover:-translate-y-1">
      <div
        className={`w-14 h-14 flex items-center justify-center rounded-xl text-white bg-gradient-to-br ${accentFrom} ${accentTo} shrink-0`}
        aria-hidden
      >
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-2xl font-bold text-gray-900">{formatted}</p>
      </div>
    </div>
  );
}

export default function DashboardStats({
  schools = 0,
  students = 0,
  subscriptions = 0,
}) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [locationDataPage, setLocationDataPage] = useState(0);
  const [locationDataRowsPerPage, setLocationDataRowsPerPage] = useState(10);
  const [schoolHistoryPage, setSchoolHistoryPage] = useState(0);
  const [schoolHistoryRowsPerPage, setSchoolHistoryRowsPerPage] = useState(10);
  const [showHistory, setShowHistory] = useState(false);
  const [locationId, setLocationId] = useState(null);
  const [studentID, setStudentID] = useState(null);
  const [open,setOpen] = useState(false);
  const [getCampusDetails,setCampusDetails] = useState(null);
   const [refetch, setRefetch] = useState(null)

  const { data } = useFetchData(
    `api/subscribers/locations/stats?page=${page + 1}&limit=${rowsPerPage}`,
    refetch,
    "logs"
  );
   let statsValue = data?.data || [];
  const statsPagination = data?.pagination || {};

  const { data: locationData } = useFetchData(
    `api/subscribers/locations/${locationId}?page=${locationDataPage + 1}&limit=${locationDataRowsPerPage}`,
    null,
    "logs"
  );
  const subscriptionList = locationData?.data || [];
  const locationPagination = {
    total: locationData?.total || 0,
    page: locationData?.page || 1,
    limit: locationData?.limit || rowsPerPage,
  };

  const { data: schoolHistory } = useFetchData(
    `api/subscribers/${studentID}/history?page=${schoolHistoryPage + 1}&limit=${schoolHistoryRowsPerPage}`,
    null,
    "logs"
  );
  const summaryInfo = data?.summary;

  const handleClose = ()=>{
    setOpen(false);
    setCampusDetails(null);
  }

  return (
    <section className="p-6 w-full">
      <div className="w-fullmx-auto">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-2">
          <StatCard
            title="Schools"
            value={summaryInfo?.total_schools}
            accent="indigo"
            icon={
              // building / school icon
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 11.5L12 6l9 5.5M4.5 20.25V11.5l7.5-4.25 7.5 4.25v8.75"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 21v-6h6v6"
                />
              </svg>
            }
          />

          <StatCard
            title="Students"
            value={summaryInfo?.total_students}
            accent="green"
            icon={
              // users icon
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20v-1a4 4 0 00-4-4H9a4 4 0 00-4 4v1"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11a4 4 0 100-8 4 4 0 000 8z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 8a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />

          <StatCard
            title="Subscriptions"
            value={summaryInfo?.total_subscribers}
            accent="rose"
            icon={
              // subscription / receipt icon
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 14l2 2 4-4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h11"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 7h.01"
                />
              </svg>
            }
          />
        </div>
      </div>

      {locationId && showHistory ? (
        <TableContainer component={Paper} className="rounded-xl mt-6">
          <Button
            sx={{ display: "flex", gap: 1, alignItems: "center", marginBottom: '1rem' }}
            variant="outlined"
            onClick={() => { setShowHistory(false); setStudentID(null) }}
          >
            <ArrowBackOutlined /> Back
          </Button>
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>Student</TableCell>
                {/* <TableCell>Class</TableCell> */}
                <TableCell>Contact</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Expiry Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {schoolHistory?.data?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item?.student_info?.student_name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">ID: {item?.student_info?.registration_number || 'N/A'}</div>
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    {item?.student_info?.class_info ?
                      `${item?.student_info?.class_info.class_name} ${item?.student_info?.class_info.section} (${item?.student_info?.class_info.academic_year})`
                      : 'N/A'
                    }
                  </TableCell> */}
                  <TableCell>{item?.student_info?.contact_number || 'N/A'}</TableCell>
                  <TableCell>{item?.subscription_type}</TableCell>
                  <TableCell>₹{item.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${item.payment_status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {item.payment_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(item.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.expire_date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}

              {(!schoolHistory?.data || schoolHistory?.data?.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No subscription history found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination remains the same */}
          {/* <TablePagination
            component="div"
            count={schoolHistory.total || 0}
            page={schoolHistory.page - 1 || 0}
            onPageChange={(_, newPage) => setSchoolHistoryPage(newPage + 1)}
            rowsPerPage={schoolHistory.limit || 10}
            onRowsPerPageChange={(e) => {
              setSchoolHistoryRowsPerPage(parseInt(e.target.value, 10));
              setSchoolHistoryPage(1);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          /> */}
        </TableContainer>
      ) :
        locationId && !showHistory ?
          <TableContainer component={Paper} className="rounded-xl mt-6">
            <Button sx={{ display: "flex", gap: 1, alignItems: "center", marginBottom: '1rem' }} variant="outlined" onClick={() => { setLocationId(null) }}><ArrowBackOutlined /> Back</Button>
            <Table>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {subscriptionList.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item?.student_info?.student_name} - {item?.student_info?.registration_number}</TableCell>
                    <TableCell>₹{item.amount}</TableCell>

                    <TableCell>
                      {item.subscription_type}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${item.payment_status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {item.payment_status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${item.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>

                    <TableCell>
                      {new Date(item.start_date).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      {new Date(item.expire_date).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Button variant="outlined" color="primary" onClick={() => {
                        setStudentID(item.student_id);
                        setShowHistory(true);
                      }}>View Student History</Button>
                    </TableCell>
                  </TableRow>
                ))}

                {subscriptionList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No subscription history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* ✅ Pagination */}
            <TablePagination
              component="div"
              count={locationPagination.total}
              page={page}
              onPageChange={(_, newPage) => setLocationDataPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setLocationDataRowsPerPage(parseInt(e.target.value, 10));
                setLocationDataPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
          :
          <TableContainer component={Paper} className="rounded-xl">
            <Table>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Base URL</TableCell>
                  <TableCell>Subscription Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {statsValue.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.baseUrl}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.amount}
                    </TableCell>
                    <TableCell>
                      <Button onClick={()=>{setCampusDetails(item);setOpen(true);}}><Edit /></Button>
                      <Button variant="outlined" color="success" onClick={() => setLocationId(item._id)}>View School</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* ✅ Pagination */}
            <TablePagination
              component="div"
              count={statsPagination.total || 0}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0); // reset page on limit change
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
      }

      <CampusDialog
        open={open}
        onClose={handleClose}
        campus={getCampusDetails}
        page={page}
        rowsPerPage={rowsPerPage}
        setRefetch={setRefetch}
      />

    </section>
  );
}
