import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

/**
 * Reusable MUI DataGrid component
 */
export default function CommonDataGrid({
  rows,
  columns,
  pageSize = 10,
  height = 450,
  width = "100%",
  rowsPerPageOptions = [5, 10, 25, 50],
}) {
  return (
    <Box sx={{ height: height, width: width }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={rowsPerPageOptions} // ✅ correct prop name
        initialState={{
          pagination: {
            paginationModel: { pageSize: pageSize, page: 0 }, // ✅ default to 10 per page
          },
        }}
        disableRowSelectionOnClick
        disableColumnSelection
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
        }}
      />
    </Box>
  );
}
