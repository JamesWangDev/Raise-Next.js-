import useSWR from "swr";
const fetcher = (url) => fetch(url).then((r) => r.json());
import { useRouter } from "next/router";
import PageTitle from "components/PageTitle";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useCallback, useReducer } from "react";
import { useSupabase } from "lib/supabaseHooks";
import { parseSQL } from "react-querybuilder";
import Breadcrumbs from "components/Breadcrumbs";
import PersonProfile from "components/PersonProfile";
import { useUser } from "@clerk/nextjs";
import { XMarkIcon } from "@heroicons/react/24/outline";

const reducer = (prevState, payload) => {
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

    // Append to end
    return [...prevState, payload.new];
};

export default function StartCallingSession() {
    const router = useRouter();
    const { callSessionID } = router.query;
    const supabase = useSupabase();

    const [session, setSession] = useState([]);
    const [conferenceUpdates, appendConferenceUpdate] = useReducer(reducer, []);
    const [conferenceSID, setConferenceSID] = useState(null);
    const [dialedIn, setDialedIn] = useState(false);
    const [outbound, setOutbound] = useState(false);
    const [peopleList, setPeopleList] = useState();
    const [forceFetchValue, forceFetchPersonProfile] = useReducer((old) => old + 1, 0);
    const [dialedInFrom, setDialedInFrom] = useState(null);

    const me =
        session?.call_session_participants?.filter(
            (participant) => participant.number_dialed_in_from == dialedInFrom
        )[0] || null;

    console.log({ me });

    // Handler for dialing in
    useEffect(() => {
        // Ignore onMount
        if (!dialedInFrom) return () => {};

        // Upsert the new dialedInFrom status
        // TODO: correct uniqueness test for upsert
        supabase
            .from("call_session_participants")
            .upsert(
                {
                    call_session_id: callSessionID,
                    number_dialed_in_from: dialedInFrom,
                },
                { onConflict: "call_session_id,number_dialed_in_from" }
            )
            .then(console.log);
    }, [dialedInFrom, supabase, callSessionID]);

    let hasNext = peopleList?.indexOf(session.current_person_id) < peopleList?.length - 1;

    function leave() {
        router.push("/dialer");
    }

    // On mount, fetch session data
    const fetchSessionData = useCallback(() => {
        supabase
            .from("call_sessions")
            .select("*, saved_lists (*), call_session_participants (*)")
            .eq("id", callSessionID)
            .single()
            .then(({ data: currentSessionData, error }) => {
                if (error) {
                    throw Error("Error fetching call session+list " + JSON.stringify(error));
                } else setSession(currentSessionData);
                const urlToFetch = `/api/rq?query=${encodeURI(
                    `select id from people where ${currentSessionData.saved_lists.query}`
                )}`;
                fetcher(urlToFetch).then((currentListsData) => {
                    let temporaryPeopleList = Array.from(currentListsData.map((row) => row.id));
                    setPeopleList(temporaryPeopleList);
                });
            });
    }, [callSessionID, supabase]);

    // On mount
    useEffect(() => {
        // Fetch the list of calling sessions from the API.
        fetchSessionData();

        console.log("subscribeToPageChanges()");
        const sessionChannel = supabase
            .channel("call_sessions")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "call_sessions",
                },
                ({ new: updated }) => {
                    console.log(updated.current_person_id);
                    setSession((prevState) => ({
                        ...prevState,
                        current_person_id: updated.current_person_id,
                    }));
                }
            )
            .subscribe();

        // Subscribe to call_session_participants to get updated participants and callsids
        const participantsChannel = supabase
            .channel("call_session_participants")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "call_session_participants",
                    filter: "call_session_id=eq." + callSessionID,
                },
                (payload) => {
                    console.log({ payload });
                    // Temporary simple solution:
                    fetchSessionData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(sessionChannel);
            supabase.removeChannel(participantsChannel);
        };
    }, [fetchSessionData, supabase]);

    // Mutation of current person/page triggers fetch
    const setPersonID = useCallback(
        (newID) => {
            console.log("setPersonID");
            supabase
                .from("call_sessions")
                .update({ current_person_id: newID })
                .eq("id", callSessionID)
                .then(fetchSessionData);
        },
        [supabase, callSessionID, fetchSessionData]
    );

    // Find the current person in the list, and move to the next one.
    const nextPerson = useCallback(() => {
        let currentIndex = peopleList.indexOf(session.current_person_id);
        let nextIndex = currentIndex + 1;
        if (nextIndex >= peopleList.length) return false;
        setPersonID(peopleList[nextIndex]);
    }, [setPersonID, peopleList?.length, session?.current_person_id]);

    useEffect(() => {
        if (!session?.current_person_id && peopleList?.length) {
            setPersonID(peopleList[0]);
        }
    }, [setPersonID, peopleList?.length, session?.current_person_id]);

    // Supabase realtime
    useEffect(() => {
        console.log("useffect1");
        console.log({ conferenceUpdates });

        if (conferenceUpdates?.length === 0) {
            return () => {};
        }

        if (conferenceSID === null) setConferenceSID(conferenceUpdates[0].conference_sid);

        let _dialedIn = false;
        let _outbound = false;
        for (const update of conferenceUpdates) {
            const isItMe = update.call_sid == me?.call_sid;

            // Dialed in?
            if (isItMe) {
                if (update.status_callback_event === "participant-join") {
                    _dialedIn = true;
                }
                if (update.status_callback_event === "participant-leave") {
                    _dialedIn = false;
                }
            }

            // Outbound call active?
            if (update?.participant_label?.includes("outboundCall")) {
                if (update.status_callback_event === "participant-join") {
                    _outbound = true;
                }
                if (update.status_callback_event === "participant-leave") {
                    _outbound = false;
                }
            }
        }
        setDialedIn(_dialedIn);
        setOutbound(_outbound);

        console.log({ _dialedIn, _outbound });

        forceFetchPersonProfile();
    }, [conferenceUpdates, conferenceSID, me?.call_sid]);

    // useEffectOnMount to setup subscription
    useEffect(() => {
        console.log("useffect2");

        // Load entire updates
        supabase
            .from("conference_updates")
            .select()
            .order("inserted_at", { ascending: true })
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
                    conferenceSID +
                    "&personID=" +
                    session.current_person_id
            )
        ).json();
        console.log(response);
        return response;
    }

    return (
        <>
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
                                name: `Calling list "${session?.saved_lists?.name}"`,
                                href: `/dialer/${callSessionID}`,
                                current: false,
                            },
                        ]}
                    />
                    {/* <PageTitle
                        title={`Dial list: "${session?.saved_lists?.name}"`}
                        descriptor="Enter your phone number below and then dial in to connect."
                    /> */}
                </div>
                <div className="mx-auto max-w-7xl px-2">
                    <div className="p-0 block pb-3 mt-3">
                        <div className="text-blue-700 p-3 px-8 pt-0 block w-full rounded-2xl bg-blue-50 ring-0 ring-opacity-5 border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            {dialedIn ? (
                                <div className="pt-3.5 pb-0.5">
                                    <span className="inline-block">
                                        You&apos;re dialed in to the call session!
                                    </span>
                                    <div className="inline-block align-middle ml-3">
                                        <button
                                            className="text-sm button-xs btn-xs align-center"
                                            type="button"
                                            onClick={leave}
                                        >
                                            <XMarkIcon className="h-4 w-4 align-center inline-flex mx-auto mr-2" />
                                            Leave Session
                                        </button>
                                    </div>
                                </div>
                            ) : !dialedInFrom ? (
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
                                    <div className="mt-3 inline-block">
                                        <span className="mr-2 inline-block font-normal text-sm">
                                            Get started dialing:
                                        </span>
                                        <div className="relative inline-block">
                                            <label
                                                htmlFor="dialedInFromInput"
                                                className="absolute -top-2 left-2 inline-block  px-1 text-xs font-medium text-gray-900 bg-blue-50"
                                            >
                                                <span className="inline-block px-1 text-blue-700">
                                                    Your phone number
                                                </span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="dialedInFromInput"
                                                id="dialedInFromInput"
                                                className="mr-2 inline w-48 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 ring-2 ring-inset ring-indigo-600 sm:text-sm sm:leading-6 bg-blue-50"
                                                placeholder="(555) 555 - 5555"
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary">
                                            Make calls
                                        </button>
                                    </div>
                                    <h3 className="mt-0 text-blue-700 text-base inline-block ml-5"></h3>
                                </form>
                            ) : (
                                <>
                                    <p className="mt-3.5 mb-1 text-blue-700 text-lg font-semibold inline-block mr-3">
                                        <PhoneIcon className="h-6 w-6 text-blue-700 align-center inline-flex mx-auto mr-2" />{" "}
                                        {process.env.NEXT_PUBLIC_DIALER_NUMBER}
                                    </p>
                                    <p className="mt-2 inline-block text-base font-normal text-blue-700">
                                        Call this number with your phone to connect to the dialer.
                                    </p>
                                    {/* <p className="mt-2 inline-block text-base text-gray-300 italic">
                                            You should be calling in from {dialedInFrom}
                                        </p> */}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <>
                <div class="no-negative-top">
                    <PersonProfile
                        enabled={dialedIn}
                        personID={session.current_person_id}
                        dial={dial}
                        hangup={hangup}
                        next={nextPerson}
                        hasNext={hasNext}
                        outbound={outbound}
                        forceFetch={forceFetchValue}
                    />
                </div>
            </>
        </>
    );
}
