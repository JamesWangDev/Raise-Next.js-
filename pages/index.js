import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
// import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSession, signIn, signOut } from "next-auth/react";
import supabase from "../utils/supabase";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

var columns = [
  { field: "id", headerName: "id", width: 70 },
  { field: "created_at", headerName: "created_at", width: 130 },
  { field: "text", headerName: "text", width: 130 },
];

export default function Dashboard({ rows }) {
  const { data: session, status } = useSession();

  if (session) {
    return (
      <div className="container">
        <h1>Dashboard</h1>
        {/* Welcome, {session.user.name} */}
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            sx={{
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
  if (!session) {
    return (
      <div className="container">
        <h1>Login</h1>
        Click to sign into your user account <br />
        <button
          type="button"
          className="btn btn-blue"
          onClick={() => signIn("google")}
        >
          <Image src="/google.svg" height="15" width="15" className="mr-2" />
          Sign in
        </button>
      </div>
    );
  }
}

export const getServerSideProps = async () => {
  const { data: rows, error } = await supabase.from("testTable").select();
  return { props: { rows } };
};
