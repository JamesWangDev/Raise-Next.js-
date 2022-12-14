import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Box from "@mui/material/Box";
import supabase from "../utils/supabase";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

export default function QueryBuilder({ children, table, query = "*" }) {
  return (
    <>
      <div>query Builder time!!!</div>
      {children}
    </>
  );
}
