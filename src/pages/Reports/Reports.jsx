import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { BarChart3, ReceiptIndianRupee, ShoppingCart, ChevronRight, User } from "lucide-react";
import { Input } from "../../components/ui/input";
import { useSnackbar } from "notistack";
import { Autocomplete, TextField } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import useFetchData from "../../hooks/useFetchData";
import { usePostData } from "../../hooks/usePostData";

const reportTypes = [
  { id: 1, title: "Student Reports", description: "Add/edit/delete students, view profiles, assign classes", apiUrl: "reports/student-report" },
  { id: 2, title: "Fees Reports", description: "Track payments, generate receipts, export reports", apiUrl: "reports/fees-report" },
  {
    id: 3,
    title: "Canteen Sales",
    description: "Revenue and item sales data",
    apiUrl: 'reports/tuckshop-sales-report'
  },
  {
    id: 4,
    title: "Transaction Summary",
    description: "Daily, weekly, monthly summaries",
    apiUrl: 'reports/transaction-summary-report'
  }, {
    id: 5,
    title: "Inventory",
    description: "Total wages paid by department",
    apiUrl: 'reports/inventory-report'
  }];

function Reports() {
  const { enqueueSnackbar } = useSnackbar();
  const [apiUrl, setApiUrl] = useState(reportTypes[0]);
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { data: students } = useFetchData("students"); // Fetch students for autocomplete
  const { data: classes } = useFetchData("classes"); // Fetch classes/sections

  const payload = selectedDateRange === "custom"
    ? { startDate: customStartDate, endDate: customEndDate, format: selectedFormat, class: selectedClass, studentId: selectedStudent?.id || null }
    : { dateRange: selectedDateRange, format: selectedFormat, class: selectedClass, studentId: selectedStudent?.id || null };

  useEffect(() => {
    setSelectedDateRange("");
    setCustomStartDate("");
    setCustomEndDate("");
    setSelectedFormat("pdf");
    setSelectedClass("");
    setSelectedStudent(null);
  }, [apiUrl]);

  async function postData() {
    const { data, error } = await usePostData(apiUrl.apiUrl, payload, "post");

    if (error) {
      enqueueSnackbar(error?.message || "Error generating report", { variant: "error" });
      return;
    }

    const reportName = apiUrl.title.replace(/\s+/g, "_");
    if (selectedFormat === "pdf") {
      if (!data || data.length === 0) {
        enqueueSnackbar("No data to generate PDF", { variant: "warning" });
        return;
      }
      const columnsSet = new Set();
      data.forEach(item => Object.keys(item).forEach(k => columnsSet.add(k)));
      const columns = Array.from(columnsSet);
      const rows = data.map(item => columns.map(col => item[col] ?? ""));
      const doc = new jsPDF('l', 'pt', 'a4');
      doc.setFontSize(14);
      doc.text(`${reportName}`, 40, 40);
      autoTable(doc, { head: [columns], body: rows, startY: 60, styles: { fontSize: 7 } });
      doc.save(`${reportName}.pdf`);
    } else {
      enqueueSnackbar("Report generated successfully", { variant: "success" });
    }
  }

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 bg-gray-50">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Reports</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Types */}
          <Card className="lg:col-span-1 border border-blue-500">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Report Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {reportTypes.map((report, idx) => (
                <div key={idx} onClick={() => setApiUrl(report)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${report.id === apiUrl.id ? "border-blue-500" : "border-gray-200"}`}>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm md:text-base">{report.title}</h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">{report.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Report Parameters */}
          <Card className="lg:col-span-1 border border-blue-500">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Report Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select date range" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7daysago">Last 7 days</SelectItem>
                    <SelectItem value="1monthago">Last 30 days</SelectItem>
                    <SelectItem value="3monthsago">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
                {selectedDateRange === "custom" && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
                    <Input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
                  </div>
                )}
              </div>

              {/* Class Filter (for students/fees) */}
              {(apiUrl.id === 1 || apiUrl.id === 2) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class / Section</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    {classes?.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                  </Select>
                </div>
              )}

              {/* Student Filter */}
              {(apiUrl.id === 1 || apiUrl.id === 2) && (
                <Autocomplete
                  options={students}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  onChange={(e, newValue) => setSelectedStudent(newValue)}
                  renderInput={(params) => <TextField {...params} size="small" label="Select Student" variant="outlined" fullWidth />}
                />
              )}

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select format" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" onClick={postData}>
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="lg:col-span-1 border border-blue-500">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded mb-2">
                <div><p className="text-sm text-gray-600">Total Students</p><p className="font-bold text-xl">120</p></div>
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded mb-2">
                <div><p className="text-sm text-gray-600">Pending Fees</p><p className="font-bold text-xl">25</p></div>
                <ReceiptIndianRupee className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded">
                <div><p className="text-sm text-gray-600">Today's Orders</p><p className="font-bold text-xl">45</p></div>
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Reports;
