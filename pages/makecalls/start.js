import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import PageTitle from "../../components/PageTitle";

import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";

export default function MakeCallsPage() {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        // Fetch the list of calling sessions from the API.
        supabase
            .from("call_sessions")
            .select("*")
            .then(({ data, error }) => {
                if (error) console.log("Error fetching sessions", error);
                else setSessions(data);
            });
    }, []);

    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-2 ">
                <PageTitle
                    title="Start a new calling session"
                    descriptor="Choose the list to dial into."
                />
            </div>
            <div className="mx-auto max-w-7xl px-2">
                
            
            </div>
        </div>
    );
}
