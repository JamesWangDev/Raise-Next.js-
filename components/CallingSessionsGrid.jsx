// necessary imports
import { useState, useEffect } from "react";
import Link from "next/link";
import supabase from "utils/supabase";

// import useorganization from clerk.dev
import { useOrganization } from "@clerk/nextjs";

export default function CallingSessionsGrid() {
    // get orgid using clerk
    const { organization } = useOrganization();

    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        // Fetch the list of calling sessions from the API.
        supabase
            .from("call_sessions")
            .select("*")
            .eq("organization_id", organization.id)
            .then(({ data, error }) => {
                if (error) console.log("Error fetching sessions", error);
                else setSessions(data);
            });
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {sessions?.map((session) => (
                <>
                    <div className="bg-white rounded-lg shadow-sm p-6 pt-0 hover:shadow-lg hover:cursor-pointer border">
                        <h3>List ID: {session.list_id}</h3>
                        <p className="text-gray-400 mt-2 font-normal">
                            Started on:{" "}
                            {new Date(session.started).toLocaleDateString()}
                        </p>
                        <Link
                            href="/call/1"
                            className="block mt-4 text-blue-600 hover:underline underline underline-offset-4 text-base font-normal"
                        >
                            Join this session
                        </Link>
                    </div>
                </>
            ))}
        </div>
    );
}
