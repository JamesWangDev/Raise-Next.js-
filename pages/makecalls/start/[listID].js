import useSWR from "swr";
import axios from "axios";
const fetcher = (url) => axios.get(url).then((res) => res.data);

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import PageTitle from "../../../components/PageTitle";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";
import { parseSQL } from "react-querybuilder";

import PersonProfile from "../../../components/PersonProfile";

// Import firebase utils
import {
    firebase,
    db,
    functions,
    dial,
    hangup,
    dialerAdvanced,
    handleConferenceUpdateSnapshot,
    onSnapshot,
    query,
    collection,
    orderBy,
} from "../../../utils/firebase";

export default function StartCallingSession() {
    const router = useRouter();
    const { listID } = router.query;

    const [sessions, setSessions] = useState([]);
    const [conferenceUpdates, updateConference] = useState();
    const [dialedIn, setDialedIn] = useState(false);
    const [personID, setPersonID] = useState();
    const [outbound, setOutbound] = useState();
    const [peopleList, setPeopleList] = useState();

    function nextPerson() {
        // Find the current person in the list, and move to the next one.
        let currentIndex = peopleList.indexOf(personID);
        let nextIndex = currentIndex + 1;
        if (nextIndex >= peopleList.length) nextIndex = 0;
        setPersonID(peopleList[nextIndex]);
    }

    useEffect(() => {
        // Fetch the list of calling sessions from the API.
        supabase
            .from("call_sessions")
            .select("*")
            .then(({ data, error }) => {
                if (error) console.log("Error fetching sessions", error);
                else setSessions(data);
            });

        // Fetch the saved_list (as query) and execute it to return a people list
        supabase
            .from("saved_lists")
            .select("*")
            .eq("id", listID)
            .single()
            .limit(1)
            .then(({ data, error }) => {
                if (error) console.log("Error fetching list", error);

                const urlToFetch = `/api/rq?start=0&query=${encodeURI(
                    `select id from people where ${data.query}`
                )}`;
                axios.get(urlToFetch).then((res) => {
                    let temporaryPeopleList = Array.from(
                        res.data.map((row) => row.id)
                    );
                    setPeopleList(temporaryPeopleList);
                    setPersonID(temporaryPeopleList[0]);
                });
            });
    }, []);

    useEffect(() => {
        // Subscribe to the conference updates snapshot listener.
        const conferenceUpdatesRef = onSnapshot(
            query(
                collection(db, "conference-updates"),
                orderBy("Timestamp", "desc")
            ),
            // Handler for the conference updates snapshot listener.
            (snapshot) => {
                console.log("firebase snapshot fired");

                // Rebuild the latest conference update using the special iterator
                let allUpdates = [];
                snapshot.forEach((doc) => {
                    allUpdates.push(doc.data());
                });

                // Set state
                updateConference(allUpdates);

                // Determine if we're currently dialed in
                if (
                    (allUpdates[0].StatusCallbackEvent == "conference-end" ||
                        allUpdates[1].StatusCallbackEvent ==
                            "conference-end") &&
                    allUpdates[0].StatusCallbackEvent != "participant-join"
                )
                    setDialedIn(false);
                else setDialedIn(true);
            }
        );
        return () => {
            // Unsubscribe from the conference updates snapshot listener.
            conferenceUpdatesRef();
        };
    }, []);

    return dialedIn ? (
        <>
            You're dialed in!
            <DialingControls personID={personID} outbound={outbound} />
            <PersonProfile personID={personID} />
        </>
    ) : (
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

function DialingControls({ personID, outbound }) {
    // A react component that returns a tailwind button group for dial, hangup, and next person.
    return (
        <div className="flex justify-center">
            <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => dial(outbound)}
            >
                Dial
            </button>
            <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => hangup()}
                {...(outbound ? {} : { disabled: true })}
            >
                Hang Up
            </button>
            <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                onClick={() => nextPerson()}
                {...(!outbound ? {} : { disabled: true })}
            >
                Next
            </button>
        </div>
    );
}
