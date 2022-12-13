import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Box from "@mui/material/Box";
import supabase from "../utils/supabase";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

export default function SupabaseTable({ table }) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  var rowCount = 0;
  const [rowCountState, setRowCountState] = useState(rowCount);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      rowCount !== undefined ? rowCount : prevRowCountState
    );
  }, [rowCount, setRowCountState]);

  useEffect(() => {
    setLoading(true);

    supabase
      .from(table)
      .select()
      // .limit(50)
      .range(page * 10, (page + 1) * 10)
      .then((data) => {
        setData(data.data);
        setLoading(false);
      });

    supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .then((data) => setRowCountState(data.count));
  }, [page, setPage]);

  // if (isLoading) return <p>Loading...</p>;
  // if (!data) return <p>No profile data</p>;

  var rows = data ? data.map((row) => ({ id: row["Receipt ID"], ...row })) : [];

  var columns = data
    ? Object.keys(rows[0]).map((columnName) => ({
        field: columnName,
        headerName: columnName,
        width: 70,
      }))
    : [];

  return (
    <>
      <Box sx={{ height: "75vh", width: "100%" }}>
        <DataGrid
          paginationMode="server"
          rowCount={rowCountState}
          loading={isLoading}
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          onPageChange={setPage}
          className="bg-white"
          sx={{
            my: 2,
            fontFamily: "Inter",
            "& .MuiDataGrid-columnHeader .MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-columnHeader": {
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </>
  );
}
