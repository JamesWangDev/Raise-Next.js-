import useSWR from "swr";
import axios from "axios";
const fetcher = (url) => axios.get(url).then((res) => res.data);
// const fetcher = (url) => fetch(url).then((res) => res.json());

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Box from "@mui/material/Box";
import supabase from "../utils/supabase";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { InstallMobileRounded } from "@mui/icons-material";

export default function SupabaseTable({
  table,
  query = "*",
  currentQuery,
  setFilterColumns = function () {},
}) {
  var rowCount = 0;
  const [rowCountState, setRowCountState] = useState(rowCount);
  const [page, setPage] = useState(0);

  // const [data, setData] = useState(null);
  const { data, error } = useSWR(
    `/api/rq?start=${encodeURI(page * 25)}&query=${encodeURI(
      `select * from ${table} where ${currentQuery} limit 25`
    )}`,
    fetcher
  );
  if (error) console.log(error); // "An error has occurred.";
  const rows = data ? data : [];

  // setFilterColumns(columns);

  // useEffect(() => {
  //   setRowCountState((prevRowCountState) =>
  //     rowCount !== undefined ? rowCount : prevRowCountState
  //   );
  // }, [rowCount, setRowCountState]);

  // useEffect(() => {
  //   setLoading(true);

  //   var query_ref = supabase
  //     .from(table)
  //     .select("*", { count: "estimated", head: false });

  //   const convert_sql_operators_to_postgrest = {
  //     // sql: "postgrest",
  //     "=": "eq",
  //     ">": "gt",
  //     ">=": "gte",
  //     "<": "lt",
  //     "<=": "lte",
  //     "<>": "or",
  //     "!=": "neq",
  //     LIKE: "like",
  //     ILIKE: "ilike",
  //     IN: "in",
  //     IS: "is",
  //     "@@": "fts",
  //     "@@": "plfts",
  //     "@@": "phfts",
  //     "@@": "wfts",
  //     "@>": "cs",
  //     "<@": "cd",
  //     "&&": "ov",
  //     "<<": "sl",
  //     ">>": "sr",
  //     "&<": "nxr",
  //     "&>": "nxl",
  //     "-|-": "adj",
  //     NOT: "not",
  //   };

  //   if (currentQuery && currentQuery.rules && currentQuery.rules[0]) {
  //     currentQuery.rules.forEach((rule) => {
  //       query_ref = query_ref.filter(
  //         rule.field,
  //         convert_sql_operators_to_postgrest[rule.operator],
  //         rule.value
  //       );
  //     });
  //   }

  //   // query_ref.range(page * 25, (page + 1) * 25).then((data) => {
  //   //   console.log("data", data);
  //   //   if (
  //   //     data &&
  //   //     data.data &&
  //   //     data.data[0] &&
  //   //     Object.keys(data.data[0]).length > 0
  //   //   )
  //   //     setFilterColumns(Object.keys(data.data[0]));
  //   //   setData(data.data);
  //   //   setLoading(false);
  //   //   setRowCountState(data.count ? data.count : 0);
  //   // });

  // }, [page, setPage, currentQuery]);

  // Make the first row an id column if none present because mui datatable requires it
  // ...&if there is no data, then pass a blank rows array
  // if (data && data[0])
  //   var rows = data
  //     ? "id" in data[0]
  //       ? data
  //       : data.map((row) => ({ id: row[Object.keys(row)[0]], ...row }))
  //     : [];
  // else var rows = [];

  // // Extract columns
  if (data && data[0])
    var columns = data
      ? Object.keys(rows[0]).map((columnName) => ({
          field: columnName,
          headerName: columnName,
          width: 120,
        }))
      : [];
  else var columns = [];
  console.log("columns", columns);

  return (
    <>
      <Box sx={{ height: "60vh", width: "100%" }}>
        <DataGrid
          paginationMode="server"
          rowCount={rowCountState}
          loading={!data}
          rows={rows}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[25]}
          checkboxSelection
          onPageChange={setPage}
          className="bg-white"
          sx={{
            my: 2,
            "& .MuiDataGrid-columnHeader .MuiDataGrid-columnSeparator": {
              display: "none",
            },
            // "& .MuiDataGrid-columnHeader": {
            //   fontWeight: "bold",
            // },
          }}
        />
      </Box>
    </>
  );
}
