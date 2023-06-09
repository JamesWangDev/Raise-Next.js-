// necessary imports
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSupabase, useQuery } from "lib/supabaseHooks";

export default function CallingSessionsGrid({ hideStart }) {
    const { data: sessions, error } = useQuery(
        useSupabase().from("call_sessions").select("*, saved_lists (*)")
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {sessions?.map((session) => (
                <Link href={"/dialer/" + session.id} key={session.id}>
                    <div className="call-session-card">
                        <h3 className="mt-6">List: {session.saved_lists.query}</h3>
                        <p className="text-gray-400 mt-2 font-normal">
                            Started on: {new Date(session.started).toLocaleDateString()}
                        </p>
                        <span className="call-session-card-link">Join this session</span>
                    </div>
                </Link>
            ))}
            {!hideStart && (
                <Link href="/dialer">
                    <div className="call-session-card">
                        <h3 className="mt-6">Start a new session</h3>
                        <p className="text-gray-400 mt-2 font-normal">Click to choose a list</p>
                        <span className="call-session-card-link">Make calls</span>
                    </div>
                </Link>
            )}
        </div>
    );
}
