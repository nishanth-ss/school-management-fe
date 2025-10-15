import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

/**
 * Reusable MUI DataGrid component
 */
export default function CommonDataGrid({
  rows,
  columns,
  pageSize = 5,
}) {
  return (
    <Box sx={{ height: 450, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[pageSize]}
        disableSelectionOnClick
        // 👇 Disable both row and cell selection
        disableRowSelectionOnClick
        disableColumnSelection
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
          },
          // 👇 Optional: Remove the blue focus outline when clicking a cell
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
        }}
      />
    </Box>
  );
}
