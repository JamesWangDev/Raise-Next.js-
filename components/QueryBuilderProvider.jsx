import useSWR from "swr";
import axios from "axios";
const fetcher = (url) => axios.get(url).then((res) => res.data);
// const fetcher = (url) => fetch(url).then((res) => res.json());

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

import { QueryBuilderBootstrap } from "@react-querybuilder/bootstrap";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import supabase from "../utils/supabase";
import SaveList from "./SaveList";
import SupabaseTable from "./SupabaseTable";

import {
    formatQuery,
    parseSQL,
    add,
    defaultCombinators,
    Field,
    move,
    QueryBuilder,
    remove,
    RuleGroupType,
    update,
} from "react-querybuilder";

let fields = [];

const initialQuery = {
    combinator: "and",
    rules: [
        // { field: "firstName", operator: "beginsWith", value: "Stev" },
        // { field: "lastName", operator: "in", value: "Vai,Vaughan" },
    ],
};

export default function QueryBuilderProvider({ table, children, listID }) {
    // Load the list id, name, and query if present on page load
    useEffect(() => {
        if (listID) {
            supabase
                .from("saved_lists")
                .select()
                .eq("id", listID)
                .single()
                .then((result) => {
                    let list = result.data;
                    console.log("list.query", list.query);
                    setQuery(parseSQL(list.query));
                    setList(list);
                });
        }
    });

    const [list, setList] = useState({});
    const [query, setQuery] = useState(initialQuery);

    var formatted = formatQuery(query, {
        format: "sql",
        parseNumbers: true,
    });
    // .replaceAll("like '%", "like '%");
    console.log("formatted", formatted);

    const { data: rowsForColumns, error } = useSWR(
        `/api/rq?start=0&query=${encodeURI(
            `select * from ${table} where (1 = 1) limit 25`
        )}`,
        fetcher
    );

    if (rowsForColumns && rowsForColumns[0])
        fields = Object.keys(rowsForColumns[0]).map((a) => ({
            name: a,
            label: a,
        }));
    else fields = [];

    // add a filter rule
    const addRule = () =>
        setQuery(
            add(
                query,
                { field: "first_name", operator: "contains", value: "" },
                []
            )
        );

    return (
        <>
            <div className="qbp">
                <div className="qbp-query-bar flex">
                    <pre>
                        <code>
                            Query:{" "}
                            {formatted == "(1 = 1)"
                                ? "No filters, returning all results.."
                                : formatted}
                        </code>
                    </pre>

                    <button
                        onClick={addRule}
                        className="my-1 mx-2 relative inline-block justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                    >
                        Add Filter Step
                    </button>

                    <SaveList formattedQuery={formatted} list={list} />
                </div>
                <QueryBuilderBootstrap>
                    <QueryBuilder
                        resetOnFieldChange="false"
                        resetOnOperatorChange="false"
                        debugMode
                        // showCombinatorsBetweenRules
                        fields={fields}
                        query={query}
                        onQueryChange={(q) => setQuery(q)}
                        // Prevent new groups/hide group+ button
                        controlElements={{
                            addGroupAction: () => null,
                        }}
                    />
                </QueryBuilderBootstrap>
            </div>
            <SupabaseTable table={table} currentQuery={formatted} />
        </>
    );
}
