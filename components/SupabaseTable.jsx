import useSWR from "swr";
import axios from "axios";
const fetcher = (url) => axios.get(url).then((res) => res.data);
// const fetcher = (url) => fetch(url).then((res) => res.json());

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Box from "@mui/material/Box";
import supabase from "../utils/supabase";

import Button from "@mui/material/Button";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { InstallMobileRounded } from "@mui/icons-material";

import { useRouter } from "next/router";

export default function SupabaseTable({
    table,
    query = "*",
    currentQuery,
    setFilterColumns = () => {},
}) {
    var rowCount = 0;
    const [rowCountState, setRowCountState] = useState(rowCount);
    const [page, setPage] = useState(0);

    const SWRquery =
        `select * from ${table}` +
        (!!currentQuery ? ` where ${currentQuery}` : "") +
        ` limit 25`;
    const { data, error } = useSWR(
        `/api/rq?start=${encodeURI(page * 25)}&query=${encodeURI(SWRquery)}`,
        fetcher
    );
    if (error) console.log(error); // "An error has occurred.";

    // Make the first row an id column if none present because mui datatable requires it
    // ...&if there is no data, then pass a blank rows array
    if (data && data[0])
        var rows = data
            ? "id" in data[0]
                ? data
                : data.map((row) => ({ id: row[Object.keys(row)[0]], ...row }))
            : [];
    else var rows = [];

    // Extract columns
    if (data && data[0])
        var columns = data
            ? Object.keys(rows[0]).map((columnName) => ({
                  field: columnName,
                  headerName: columnName,
              }))
            : [];
    else var columns = [];
    console.log("columns", columns);
    if (table == "saved_lists") {
        columns.push({
            field: "View/Edit Query",
            headerName: "View/Edit Query",
            renderCell: LoadListButton,
            width: 150,
        });
        columns.push({
            field: "Make Calls",
            headerName: "Make Calls",
            renderCell: MakeCallsButton,
            width: 150,
        });
    }
    if (table.toLowerCase().startsWith("people")) {
        columns.unshift({
            field: "View Person",
            headerName: "View Person",
            renderCell: ViewPersonButton,
            width: 150,
        });
    }

    return (
        <>
            <Box sx={{ height: "55vh", width: "100%" }}>
                <DataGrid
                    paginationMode="server"
                    rowCount={rowCountState}
                    loading={!data}
                    rows={rows}
                    columns={columns}
                    pageSize={25}
                    rowsPerPageOptions={[25]}
                    // checkboxSelection
                    onPageChange={setPage}
                    className="bg-white"
                    sx={{
                        my: 2,
                        "& .MuiDataGrid-columnHeader .MuiDataGrid-columnSeparator":
                            {
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

const LoadListButton = (params) => {
    const router = useRouter();
    return (
        <strong>
            <button
                className="btn btn-primary"
                color="primary"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log(params, params.row);
                    router.push("/lists/" + params.row.id);
                }}
            >
                View/Edit Query
            </button>
        </strong>
    );
};

const MakeCallsButton = (params) => {
    const router = useRouter();
    return (
        <strong>
            <button
                className="btn btn-primary"
                color="primary"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log(params, params.row);
                    router.push("/makecalls/start/" + params.row.id);
                }}
            >
                Dial List
            </button>
        </strong>
    );
};

const ViewPersonButton = (params) => {
    const router = useRouter();
    return (
        <strong>
            <button
                className="btn btn-primary"
                color="primary"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log(params, params.row);
                    router.push("/people/" + params.row.id);
                }}
            >
                View Person
            </button>
        </strong>
    );
};
