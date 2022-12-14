import { QueryBuilderBootstrap } from "@react-querybuilder/bootstrap";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import SupabaseTable from "../components/SupabaseTable";

import { formatQuery, QueryBuilder } from "react-querybuilder";

let fields = [];

const initialQuery = {
  combinator: "or",
  rules: [
    // { field: "firstName", operator: "beginsWith", value: "Stev" },
    // { field: "lastName", operator: "in", value: "Vai,Vaughan" },
  ],
};

export default function QueryBuilderProvider({ table, children }) {
  const [query, setQuery] = useState(initialQuery);
  const [filterColumns, setFilterColumns] = useState([]);

  var formatted = formatQuery(query, { format: "sql", parseNumbers: true });

  fields = filterColumns.map((a) => ({ name: a, label: a }));

  return (
    <>
      <div class="qbp">
        <pre>
          <code>
            Query:{" "}
            {formatted == "(1 = 1)"
              ? "No filters applied, returning all results"
              : formatted}
          </code>
        </pre>

        <QueryBuilderBootstrap>
          <QueryBuilder
            showCombinatorsBetweenRules
            fields={fields}
            query={query}
            onQueryChange={(q) => setQuery(q)}
          />
        </QueryBuilderBootstrap>
      </div>
      <SupabaseTable
        setFilterColumns={setFilterColumns}
        table={table}
        currentQuery={query}
      />
    </>
  );
}
