import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Box from "@mui/material/Box";
import supabase from "../utils/supabase";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

export default function SupabaseTable({
  table,
  query = "*",
  currentQuery,
  setFilterColumns,
}) {
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

    var query_ref = supabase.from(table).select(query);

    if (currentQuery && currentQuery.rules && currentQuery.rules[0]) {
      console.log("current rules", currentQuery.rules[0]);

      query_ref = query_ref.filter(
        currentQuery.rules[0].field,
        "eq",
        currentQuery.rules[0].value
      );
    }

    query_ref.range(page * 10, (page + 1) * 10).then((data) => {
      setFilterColumns(Object.keys(data.data[0]));
      setData(data.data);
      setLoading(false);
    });

    supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .then((data) => setRowCountState(data.count));
  }, [page, setPage, currentQuery]);

  // if (isLoading) return <p>Loading...</p>;
  // if (!data) return <p>No profile data</p>;

  var rows = data
    ? "id" in data[0]
      ? data
      : data.map((row) => ({ id: row[Object.keys(row)[0]], ...row }))
    : [];
  //var rows = data ? data : [];

  var columns = data
    ? Object.keys(rows[0]).map((columnName) => ({
        field: columnName,
        headerName: columnName,
        width: 70,
      }))
    : [];

  return (
    <>
      <Box sx={{ height: "60vh", width: "100%" }}>
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
