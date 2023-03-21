// necessary imports
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSupabase } from "lib/supabaseHooks";

export default function CallingSessionsGrid() {
    // get orgid using clerk
    const supabase = useSupabase();

    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        // Fetch the list of calling sessions from the API.
        supabase
            .from("call_sessions")
            .select("*")
            .then(({ data, error }) => {
                if (error) console.error("Error fetching sessions", error);
                else setSessions(data);
            });
    }, [supabase]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {sessions?.map((session) => (
                <Link href={"/dialer/" + session.id}>
                    <div
                        key={session.id}
                        className="bg-white rounded-lg shadow-md p-6 pt-0 hover:shadow-lg hover:cursor-pointer border"
                    >
                        <h3 className="mt-6">List ID: {session.list_id}</h3>
                        <p className="text-gray-400 mt-2 font-normal">
                            Started on: {new Date(session.started).toLocaleDateString()}
                        </p>
                        <span className="block mt-4 text-blue-600 hover:underline underline underline-offset-4 text-base font-normal">
                            Join this session
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
