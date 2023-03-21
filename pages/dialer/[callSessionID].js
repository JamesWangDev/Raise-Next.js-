import useSWR from "swr";
import axios from "axios";
const fetcher = (url) => axios.get(url).then((res) => res.data);
import { useRouter } from "next/router";
import PageTitle from "components/PageTitle";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useCallback, useReducer } from "react";
import { useSupabase } from "lib/supabaseHooks";
import { parseSQL } from "react-querybuilder";
import Breadcrumbs from "components/Breadcrumbs";
import PersonProfile from "components/PersonProfile";
import { useUser } from "@clerk/nextjs";

const reducer = (prevState, payload) => {
    console.log("reducer()");

    // Bulk update
    if (!payload?.hasOwnProperty("new")) {
        return [...payload];
    }

    if (!payload || !payload.hasOwnProperty("new") || !payload.new.hasOwnProperty("created_at")) {
        console.error({
            error: "Conference updates subscription payload invalid",
            payload,
        });
    }

    // Don't push same update entry ID twice to state
    if (prevState.map((item) => item.id).includes(payload.new.id)) {
        return false;
    }

    // Append to beginning
    return [payload.new, ...prevState];
};

export default function StartCallingSession() {
    const router = useRouter();
    const { callSessionID } = router.query;

    const [session, setSession] = useState([]);
    const [conferenceUpdates, appendConferenceUpdate] = useReducer(reducer, []);
    const [conferenceSID, setConferenceSID] = useState(null);
    const [dialedIn, setDialedIn] = useState(false);
    // Replaced the following with session.current_person_id server state
    // const [personID, setPersonID] = useState();
    const [outbound, setOutbound] = useState(false);
    const [peopleList, setPeopleList] = useState();
    const supabase = useSupabase();

    const dialInReducer = (prevState, number_dialed_in_from) => {
        supabase
            .from("call_session_participants")
            .upsert({
                call_session_id: callSessionID,
                number_dialed_in_from,
            })
            .then((response) => console.log);
        return number_dialed_in_from;
    };
    const [dialedInFrom, setDialedInFrom] = useReducer(dialInReducer, null);

    // Find the current person in the list, and move to the next one.
    function nextPerson() {
        let currentIndex = peopleList.indexOf(session.current_person_id);
        let nextIndex = currentIndex + 1;
        if (nextIndex >= peopleList.length) return false;
        setPersonID(peopleList[nextIndex]);
    }

    let hasNext = peopleList?.indexOf(session.current_person_id) < peopleList?.length - 1;

    function leave() {
        router.push("/dialer");
    }

    // On mount, fetch session data
    const fetchSessionData = useCallback(() => {
        supabase
            .from("call_sessions")
            .select("*, saved_lists (*)")
            .eq("id", callSessionID)
            .single()
            .then(({ data: currentSessionData, error }) => {
                if (error) console.log("Error fetching call session+list", error);
                else setSession(currentSessionData);
                const urlToFetch = `/api/rq?query=${encodeURI(
                    `select id from people where ${currentSessionData.saved_lists.query}`
                )}`;
                axios.get(urlToFetch).then(({ data: currentListsData }) => {
                    let temporaryPeopleList = Array.from(currentListsData.map((row) => row.id));
                    console.log({ temporaryPeopleList });
                    setPeopleList(temporaryPeopleList);
                    if (!currentSessionData.current_person_id && temporaryPeopleList?.length) {
                        // setPersonID(temporaryPeopleList[0]);
                        setPersonID(temporaryPeopleList[0]);
                    }
                });
            });
    }, [callSessionID, supabase, session.current_person_id]);

    useEffect(() => {
        // Fetch the list of calling sessions from the API.
        fetchSessionData();
    }, [fetchSessionData]);

    // Mutation of current person/page triggers fetch
    function setPersonID(newID) {
        supabase
            .from("call_sessions")
            .update({ current_person_id: newID })
            .eq("id", callSessionID)
            .then(fetchSessionData);
    }

    // // Supabase realtime
    // const handleSubscription = (payload) => {

    //     // updateConference([payload.new, ...conferenceUpdates]);
    //     appendConferenceUpdate(payload.new);
    // };
    useEffect(() => {
        console.log("useffect1");
        console.log("conferenceUpdates", conferenceUpdates);

        if (conferenceUpdates?.length === 0) {
            return () => {};
        }

        if (conferenceSID === null) setConferenceSID(conferenceUpdates[0].conference_sid);

        if (
            (conferenceUpdates[0]?.status_callback_event === "conference-end" ||
                conferenceUpdates[1]?.status_callback_event === "conference-end") &&
            conferenceUpdates[0]?.status_callback_event !== "participant-join"
        ) {
            // Determine if we're currently dialed in
            setDialedIn(false);
        } else {
            setDialedIn(true);
        }

        // Enable hangup button when outbound call is active, disable dial button
        if (
            conferenceUpdates[0]?.status_callback_event == "participant-join" &&
            conferenceUpdates[0]?.participant_label == "outboundCall"
        ) {
            setOutbound(true);
        }
        // Disable hangup button when outbound call ends, enable dial button
        else if (
            conferenceUpdates[0]?.status_callback_event == "participant-leave" &&
            conferenceUpdates[0]?.participant_label == "outboundCall"
        ) {
            setOutbound(false);
        }
    }, [conferenceUpdates, conferenceSID]);

    // useEffectOnMount to setup subscription
    useEffect(() => {
        console.log("useffect2");

        // Load entire updates
        supabase
            .from("conference_updates")
            .select()
            .order("inserted_at", { ascending: false })
            .then((result) => {
                appendConferenceUpdate(result?.data);
            });

        // Keep realtime updates
        const channel = supabase
            .channel("conference_updates")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "conference_updates",
                },
                (payload) => {
                    appendConferenceUpdate(payload);
                }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    async function hangup() {
        const response = await (
            await fetch("/api/dialer/hangup?conferenceSID=" + conferenceSID)
        ).json();
        console.log(response);
        return response;
    }

    async function dial(number) {
        const response = await (
            await fetch(
                "/api/dialer/dialOut?numberToDial=" +
                    number.toString() +
                    "&conferenceSID=" +
                    conferenceSID
            )
        ).json();
        console.log(response);
        return response;
    }

    return dialedIn ? (
        <>
            <div className="mx-auto max-w-7xl mb-4 px-5 p-3 shadow-sm rounded-lg bg-white ">
                <span className="flex-grow">You&apos;re dialed in to the call session!</span>
                {/* Leave call session button */}
                <button className="text-sm button-sm" type="button" onClick={leave}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    &nbsp; Leave Session
                </button>
            </div>
            <PersonProfile
                personID={session.current_person_id}
                dial={dial}
                hangup={hangup}
                next={nextPerson}
                hasNext={hasNext}
                outbound={outbound}
            />
        </>
    ) : (
        <div className="">
            <div className="mx-auto max-w-7xl px-2 ">
                <Breadcrumbs
                    pages={[
                        {
                            name: "Make Calls",
                            href: "/dialer",
                            current: false,
                        },
                        {
                            name: `Call Session #${callSessionID}`,
                            href: `/dialer/${callSessionID}`,
                            current: false,
                        },
                    ]}
                />
                <PageTitle title="Start a new calling session" descriptor="Dial in to connect." />
            </div>
            <div className="mx-auto max-w-7xl px-2">
                <div className="p-12">
                    <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        {!dialedInFrom && (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    setDialedInFrom(
                                        event.target.dialedInFromInput.value.replaceAll(
                                            /[^0-9]/g,
                                            ""
                                        )
                                    );
                                }}
                            >
                                <h3 className="mt-0">What is your phone number?</h3>
                                <div className="mt-4">
                                    <input
                                        type="tel"
                                        name="dialedInFromInput"
                                        id="dialedInFromInput"
                                        className="mr-2 inline w-48 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="(555) 555 - 5555"
                                    />
                                    <button type="submit">Submit</button>
                                </div>
                            </form>
                        )}
                        {dialedInFrom && (
                            <>
                                <p className="mb-5 text-gray-400 text-xl font-medium">
                                    <PhoneIcon className="h-10 w-10 text-gray-400 align-center inline-flex mx-auto mr-2" />{" "}
                                    {process.env.NEXT_PUBLIC_DIALER_NUMBER}
                                </p>
                                <p className="mt-2 block text-base text-gray-900">
                                    Call the above number from your cell phone to connect.
                                </p>
                                <p className="mt-2 block text-base text-gray-300 italic">
                                    You should be calling in from {dialedInFrom}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
