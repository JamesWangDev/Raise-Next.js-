import { QueryBuilderBootstrap } from "@react-querybuilder/bootstrap";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import { formatQuery, QueryBuilder } from "react-querybuilder";

const fields = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
];

const initialQuery = {
  combinator: "and",
  rules: [
    { field: "firstName", operator: "beginsWith", value: "Stev" },
    { field: "lastName", operator: "in", value: "Vai,Vaughan" },
  ],
};

export default function QueryBuilderProvider({ children }) {
  const [query, setQuery] = useState(initialQuery);

  return (
    <>
      <div class="qbp">
        <QueryBuilderBootstrap>
          <QueryBuilder
            showCombinatorsBetweenRules
            fields={fields}
            query={query}
            onQueryChange={(q) => setQuery(q)}
          />
        </QueryBuilderBootstrap>

        <h4 className="font-semibold mt-3">Query</h4>
        <pre>
          <code>
            {formatQuery(query, { format: "sql", parseNumbers: true })}
          </code>
        </pre>
      </div>
      {children}
    </>
  );
}
