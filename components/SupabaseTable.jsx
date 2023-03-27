import useSWR, { preload } from "swr";
const fetcher = (url) => fetch(url).then((r) => r.json());
import { useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import { useSupabase } from "lib/supabaseHooks";

export default function SupabaseTable({
    table,
    query = "*",
    currentQuery,
    setFilterColumns = () => {},
}) {
    const [page, setPage] = useState(0);
    // console.log({ page });
    let perPage = 25;
    let offset = page > 0 ? " OFFSET " + page * perPage : "";

    const SWRqueryWithoutLimitOffset =
        `select * from ${table}` +
        (!!currentQuery ? ` where ${currentQuery}` : "") +
        " ORDER BY created_at";
    const { data, error } = useSWR(
        `/api/rq?query=${encodeURIComponent(
            SWRqueryWithoutLimitOffset + ` limit ${perPage}` + offset
        )}`,
        fetcher
    );
    if (error) console.log(error);

    // Preload the next result using SWR, too
    preload(
        `/api/rq?query=${encodeURIComponent(
            SWRqueryWithoutLimitOffset +
                ` limit ${perPage}` +
                (page + 1 > 0 ? " OFFSET " + (page + 1) * perPage : 0)
        )}`,
        fetcher
    );

    // useSWR to get the count of rows in the table
    let encodedQuery = encodeURIComponent(
        `select count(*) from ${table}` +
            (!!currentQuery ? ` where ${currentQuery}` : "") +
            " ORDER BY created_at"
    );
    const { data: rowCountData, error: rowCountError } = useSWR(
        `/api/rq?query=${encodedQuery}`,
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
    // console.log("columns", columns);
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
        width: 150,
        sortable: false,
        filterable: false,
    }));

    // add a renderCell method on columns that don't have that method already
    columns = columns.map((column) => {
        if (!column.renderCell) {
            // Add a fulltext tooltip
            column.renderCell = (params) => {
                return (
                    <Tooltip title={params.value}>
                        <div className="MuiDataGrid-cellContent">{params.value}</div>
                    </Tooltip>
                );
            };
        }
        return column;
    });

    return (
        <>
            <Box sx={{ height: "53vh", width: "100%" }}>
                <DataGrid
                    components={{
                        NoRowsOverlay: () => (
                            <Stack height="100%" alignItems="center" justifyContent="center">
                                No records
                            </Stack>
                        ),
                    }}
                    paginationMode="server"
                    rowCount={Number(rowCount) || 0}
                    loading={!data}
                    rows={rows}
                    columns={columns}
                    pageSize={25}
                    rowsPerPageOptions={[25]}
                    checkboxSelection
                    onPageChange={setPage}
                    className="bg-white"
                    // disable sorting and filtering
                    disableColumnMenu
                    rowHeight={44}
                    sx={{
                        fontSize: "0.85rem",
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
                    // console.log(params, params.row);
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
    const supabase = useSupabase();
    return (
        <strong>
            <button
                className="btn btn-primary"
                color="primary"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    // console.log("list row params", params, params.row);

                    supabase
                        .from("call_sessions")
                        .insert({ list_id: params.row.id })
                        .select()
                        .single()
                        .then((newCallSession) => {
                            router.push("/dialer/" + newCallSession.data.id);
                        });
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
                    // console.log(router.asPath);
                    router.push(
                        (router.asPath == "/people" ? "" : router.asPath) +
                            "/people/" +
                            params.row.id
                    );
                }}
            >
                View Person
            </button>
        </strong>
    );
};
