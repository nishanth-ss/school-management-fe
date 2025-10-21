import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

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
  totalRecords, // total number of rows
  onPageChange,
  onPageSizeChange,
  page = 0,
}) {
  return (
    <Box sx={{ height: height, width: width }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={totalRecords}
        paginationMode="server"
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          const { page: newPage, pageSize: newSize } = model;
          if (newPage !== page) onPageChange(newPage);
          if (newSize !== pageSize) onPageSizeChange(newSize);
        }}
        pageSizeOptions={rowsPerPageOptions}
        disableRowSelectionOnClick
        disableColumnSelection
      />



    </Box>
  );
}

