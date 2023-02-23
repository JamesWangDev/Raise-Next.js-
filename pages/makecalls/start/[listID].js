import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import PageTitle from "../../../components/PageTitle";
// Import phoneicon from heroicons v2
import {
    Bars3BottomLeftIcon,
    BellIcon,
    CalendarIcon,
    ChartBarIcon,
    HomeIcon,
    InboxIcon,
    XMarkIcon,
    UsersIcon,
    FolderIcon,
    PhoneIcon,
    ClockIcon,
    HandRaisedIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    ChevronDoubleRightIcon,
    UserPlusIcon,
    Cog6ToothIcon,
    ChevronUpDownIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";

export default function StartCallingSession({ listID }) {
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
                    descriptor="Dial in to connect."
                />
            </div>
            <div className="mx-auto max-w-7xl px-2">
                <div className="p-12">
                    <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <p className="mb-5 text-gray-400 text-xl font-medium">
                            <PhoneIcon className="inline h-10 w-10 text-gray-400 align-center inline-flex mx-auto mr-2" />{" "}
                            (667) 242-9611
                        </p>
                        <span className="mt-2 block text-base text-gray-900">
                            Call the above number from your cell phone to
                            connect.
                        </span>
                    </div>
                </div>
                {/* <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="px-4 py-5 sm:p-6 text-center my-7">
                        Call (667) 242-9611 with your phone to start dialing.
                    </div>
                </div> */}
            </div>
        </div>
    );
}
