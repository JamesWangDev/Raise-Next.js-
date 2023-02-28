import useSWR, { preload } from "swr";
import axios from "axios";
const fetcher = (url) => axios.get(url).then((res) => res.data);
// const fetcher = (url) => fetch(url).then((res) => res.json());

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import supabase from "utils/supabase";

import Button from "@mui/material/Button";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { InstallMobileRounded } from "@mui/icons-material";

import { useRouter } from "next/router";

import { useOrganization } from "@clerk/nextjs";

export default function SupabaseTable({
    table,
    query = "*",
    currentQuery,
    setFilterColumns = () => {},
}) {
    //useorg
    const { organization } = useOrganization();

    const [page, setPage] = useState(0);
    // console.log({ page });
    let perPage = 25;
    let offset = page > 0 ? " OFFSET " + page * perPage : "";

    const SWRquery =
        `select * from ${table}` +
        (!!currentQuery ? ` where ${currentQuery}` : "") +
        ` limit ${perPage}` +
        offset;

    const { data, error } = useSWR(
        `/api/rq?orgID=${organization?.id}&query=${encodeURI(SWRquery)}`,
        fetcher
    );
    if (error) console.log(error);

    // Preload the next result using SWR, too
    preload(
        `/api/rq?orgID=${organization?.id}&query=${encodeURI(
            `select * from ${table}` +
                (!!currentQuery ? ` where ${currentQuery}` : "") +
                ` limit ${perPage}` +
                (page + 1 > 0 ? " OFFSET " + (page + 1) * perPage : 0)
        )}`,
        fetcher
    );

    // useSWR to get the count of rows in the table
    const { data: rowCountData, error: rowCountError } = useSWR(
        `/api/rq?start=0&orgID=${organization?.id}&query=${encodeURI(
            `select count(*), organization_id from ${table}` +
                (!!currentQuery ? ` where ${currentQuery}` : "") +
                " GROUP BY organization_id"
        )}`,
        fetcher
    );
    if (rowCountError) console.log(rowCountError);
    let rowCount = rowCountData?.length ? rowCountData[0]?.count : null;

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
            field: "Edit Query",
            headerName: "Edit Query",
            renderCell: LoadListButton,
            width: 150,
        });
        columns.push({
            field: "Launch Dialer",
            headerName: "Launch Dialer",
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

    columns = columns.map((column) => ({
        ...column,
        sortable: false,
        filterable: false,
    }));

    return (
        <>
            <Box sx={{ height: "55vh", width: "100%" }}>
                <DataGrid
                    paginationMode="server"
                    rowCount={rowCount}
                    loading={!data}
                    rows={rows}
                    columns={columns}
                    pageSize={25}
                    rowsPerPageOptions={[25]}
                    // checkboxSelection
                    onPageChange={setPage}
                    className="bg-white"
                    // disable sorting and filtering
                    disableColumnMenu
                    rowHeight={44}
                    sx={{
                        "font-size": "0.85rem",
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
                    router.push("/savedlists/" + params.row.id);
                }}
            >
                Edit Query
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
                New Call Session
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
