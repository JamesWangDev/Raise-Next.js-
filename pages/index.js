import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
// import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSession, signIn, signOut } from "next-auth/react";
import supabase from "../utils/supabase";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

export default function Dashboard({ rows }) {
  const { data: session, status } = useSession();

  rows = rows.map((row) => ({ id: row["Receipt ID"], ...row }));

  var columns = Object.keys(rows[0]).map((columnName) => ({
    field: columnName,
    headerName: columnName,
    width: 70,
  }));

  if (true) {
    return (
      <div className="container">
        <h1>Dashboard</h1>
        {/* Welcome, {session.user.name} */}

        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={100}
            rowsPerPageOptions={[100]}
            checkboxSelection
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
      </div>
    );
  }
  // if (!session) {
  //   return (
  //     <div className="container">
  //       <h1>Login</h1>
  //       Click to sign into your user account <br />
  //       <button
  //         type="button"
  //         className="btn btn-blue"
  //         onClick={() => signIn("google")}
  //       >
  //         <Image src="/google.svg" height="15" width="15" className="mr-2" />
  //         Sign in
  //       </button>
  //     </div>
  //   );
  // }
}

export const getServerSideProps = async () => {
  const { data: rows, error } = await supabase
    .from("donations")
    .select()
    .limit(50);
  return { props: { rows } };
};
