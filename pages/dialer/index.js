import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import PageTitle from "components/PageTitle";

import { useState, useEffect } from "react";
import { useSupabase } from "lib/supabaseHooks";
import Breadcrumbs from "components/Breadcrumbs";
import CallingSessionsGrid from "components/CallingSessionsGrid";

export default function MakeCallsPage() {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-2 ">
                <Breadcrumbs
                    pages={[
                        {
                            name: "Make Calls",
                            href: "/dialer",
                            current: false,
                        },
                    ]}
                />
                <PageTitle title="Make Calls" descriptor="Join or start a calling session." />
            </div>
            <div className="mx-auto max-w-7xl px-2">
                {/* A button for starting a new calling session */}
                <Link href="/savedlists">
                    <button className="button mt-2" type="button">
                        Start a new session
                    </button>
                </Link>{" "}
                {/* List currently active "calling sessions" as cards. */}
                <CallingSessionsGrid />
            </div>
        </div>
    );
}
