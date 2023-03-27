import Link from "next/link";
import { useSupabase, useQuery } from "lib/supabaseHooks";
import { useState, useEffect, useCallback, useMemo, useContext } from "react";
import { PhoneIcon } from "@heroicons/react/20/solid";
import InteractionHistory from "./InteractionHistory";
import Breadcrumbs from "./Breadcrumbs";
import PersonContactInfo from "./PersonContactInfo";
import { Tooltip } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import FECHistoryList from "./FECHistoryList";
import PledgeHistory from "./PledgeHistory";
import DonationHistory from "./DonationHistory";
import { randomUUID } from "lib/randomUUID-polyfill";
import { CallSessionContext } from "pages/dialer/[callSessionID]";

const pluralize = (single, plural, number) => (number > 1 ? plural : single);

function DonationsSummary({ person }) {
    const number = person?.donations?.length || 0;
    const total = person?.donations
        ?.map((donation) => donation.amount)
        ?.reduce((partialSum, a) => partialSum + a, 0);
    if (number)
        return `${number} ${pluralize("donation", "donations", number)} totalling $${total}`;
    else return "No donations";
}
function PledgesSummary({ person }) {
    const number = person?.pledges?.length || 0;
    const total = person?.pledges
        ?.map((donation) => donation.amount)
        ?.reduce((partialSum, a) => partialSum + a, 0);
    if (number) return `${number} ${pluralize("pledge", "pledges", number)} totalling $${total}`;
    else return "No pledges";
}
function PersonTagList({ person, addTag, deleteTag, restoreTag }) {
    let [newTag, setNewTag] = useState(null);
    return (
        <div>
            <h2 className="mt-5">Tags</h2>
            <div className="sm:col-span-1">
                {person.tags?.map((tag) => (
                    <dd className="mt-1 text-sm text-gray-900" key={tag.id}>
                        <span className={tag.remove_date && "line-through"}>
                            <Link className={!tag.remove_date && "link"} href={"/tags/" + tag.tag}>
                                {tag.tag}
                            </Link>
                        </span>
                        {!tag.remove_date ? (
                            <button
                                type="button"
                                className="do-not-global-style text-red-600 px-1"
                                onClick={() => {
                                    deleteTag(tag.id);
                                }}
                            >
                                x
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="do-not-global-style text-green-700 px-1 text-xs underline"
                                onClick={() => {
                                    restoreTag(tag.id);
                                }}
                            >
                                Restore
                            </button>
                        )}
                    </dd>
                ))}
                {!person.tags && <span className="text-sm">No tags</span>}
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (newTag !== null) {
                            addTag(newTag);
                            setNewTag(null);
                        } else setNewTag("");
                    }}
                >
                    {newTag !== null && (
                        <input
                            type="text"
                            name="newTag"
                            className="mt-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            autoFocus
                            onChange={(event) => {
                                setNewTag(event.target.value);
                            }}
                            value={newTag}
                        />
                    )}
                    <button
                        className={"mt-2 button-xs" + (newTag !== null ? " btn-primary" : "")}
                        type="submit"
                    >
                        Add Tag
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function PersonProfile({ personID }) {
    const { id: userID } = useUser();
    const supabase = useSupabase();
    const [bio, setBio] = useState(null);
    const {
        needsLogToAdvance,
        callSessionID,
        dial,
        hangup,
        outbound,
        hasNext,
        next,
        forceFetch,
        enabled = false,
    } = useContext(CallSessionContext);

    const { data: person, mutate: mutatePerson } = useQuery(
        useSupabase()
            .from("people")
            .select(
                "*, interactions ( * ), donations ( * ), pledges ( * ), emails ( * ), phone_numbers ( * ), tags ( * )"
            )
            .eq("id", personID)
            .single()
    );

    const { data: FECHistory } = useQuery(
        useSupabase()
            .from("alltime_individual_contributions")
            .select("*")
            .eq("name", (person?.last_name + ", " + person?.first_name).toUpperCase())
            .like("zip_code", person?.zip?.toString() + "%")
    );

    const mutations = useMemo(
        (person) => ({
            appendInteraction: async (newInteraction) => {
                let { pledge, ...newInteractionPrepared } = newInteraction;
                newInteractionPrepared.person_id = personID;

                let newPledgeID;
                if (pledge) {
                    const { data: newPledge } = await supabase
                        .from("pledges")
                        .insert({
                            person_id: personID,
                            amount: pledge,
                        })
                        .select()
                        .single();
                    newPledgeID = newPledge.id;
                }

                if (newInteractionPrepared?.note?.length) {
                    console.log({ needsLogToAdvance });
                    if (needsLogToAdvance) {
                        // Update existing call interaction
                        console.log("needs update");
                        await supabase
                            .from("interactions")
                            .update(newInteractionPrepared)
                            .eq("contact_type", "call")
                            .is("disposition", null)
                            .eq("call_session_id", callSessionID)
                            .order("inserted_at", { ascending: false })
                            .limit(1);

                        const loggingAdvanceResponse = await supabase
                            .from("call_sessions")
                            .update({ needs_log_to_advance: false })
                            .eq("id", callSessionID);
                        console.log({ loggingAdvanceResponse });
                    } else {
                        // New interaction
                        await supabase.from("interactions").insert(newInteractionPrepared);
                    }
                }

                // mutatePerson();
            },
            mutatePerson: async (changedPersonObject) =>
                await supabase.from("people").update(changedPersonObject).eq("id", personID),
            addPhone: async (newPhone) =>
                await supabase
                    .from("phone_numbers")
                    .insert({ phone_number: newPhone, person_id: personID }),
            addEmail: async (newEmail) =>
                await supabase.from("emails").insert({ email: newEmail, person_id: personID }),
            deleteEmail: async (id) =>
                await supabase
                    .from("emails")
                    .update({ remove_date: new Date().toISOString(), remove_user: userID })
                    .eq("id", id),
            deletePhone: async (id) =>
                await supabase
                    .from("phone_numbers")
                    .update({ remove_date: new Date().toISOString(), remove_user: userID })
                    .eq("id", id),
            addTag: async (newTag) =>
                supabase.from("tags").insert({ tag: newTag, person_id: personID }),
            restorePhone: async (id) =>
                await supabase
                    .from("phone_numbers")
                    .update({ remove_date: null, remove_user: null })
                    .eq("id", id),
            restoreEmail: async (id) =>
                await supabase
                    .from("emails")
                    .update({ remove_date: null, remove_user: null })
                    .eq("id", id),
            deleteTag: async (id) =>
                await supabase
                    .from("tags")
                    .update({ remove_date: new Date().toISOString(), remove_user: userID })
                    .eq("id", id),
            restoreTag: async (id) =>
                await supabase
                    .from("tags")
                    .update({ remove_date: null, remove_user: null })
                    .eq("id", id),
        }),
        [supabase, personID, mutatePerson, userID, callSessionID]
    );

    // Placing a realtime listener on changes other folks make
    useEffect(() => {
        if (!personID) return () => {};
        console.log("realtime person profile subscription ()" + personID);
        let channel = supabase.channel(randomUUID()).on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "people",
                filter: `id=eq.${personID}`,
            },
            () => {
                mutatePerson();
            }
        );
        const foreignTablesToListen = [
            "interactions",
            "pledges",
            "donations",
            "phone_numbers",
            "emails",
            "tags",
        ];
        for (let table of foreignTablesToListen) {
            channel = channel.on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: table,
                    filter: `person_id=eq.${personID}`,
                },
                () => {
                    mutatePerson();
                }
            );
        }
        channel = channel.subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, personID]);

    if (!person?.first_name) {
        return <></>;
    }

    // let interactions = person.interactions || [];
    var interactions = [
        ...person?.interactions.map((i) => ({ ...i, type: "interaction" })),
        ...person?.donations.map((i) => ({ ...i, type: "donation" })),
        ...person?.pledges.map((i) => ({ ...i, type: "pledge" })),
    ];

    // If there's no marked primary phone, use the most recently created
    // TODO: same for email
    const primaryPhoneNumber =
        person?.phone_numbers?.filter((phone) => !!phone.primary_for)[0]?.phone_number ||
        person?.phone_numbers?.sort((a, b) =>
            new Date(a.created_at) < new Date(b.created_at) ? 1 : -1
        )[0]?.phone_number;

    return (
        <div className="mx-auto max-w-7xl px-2">
            <div className="shaded-page-header">
                <div className="">
                    <Breadcrumbs
                        pages={[
                            { name: "People", href: "/people", current: false },
                            {
                                name: person.first_name + " " + person.last_name,
                                href: "/people/" + personID,
                                current: true,
                            },
                        ]}
                    />
                </div>
                <div id="person-header" className="grid grid-cols-12 gap-2">
                    <div className="col-span-8">
                        <Tooltip title={"Person ID: " + personID} arrow>
                            <h1 className="mb-0">
                                {person.first_name} {person.last_name}
                            </h1>
                        </Tooltip>
                        <h2 className="text-sm font-normal text-gray-600">
                            {person.occupation} | {person.employer} | {person.state}
                        </h2>
                        <div className="text-sm text-gray-900 font-semibold">
                            <span className="inline-flex mr-1.5">
                                <DonationsSummary person={person} />
                            </span>
                            |
                            <span className="inline-flex mx-1.5">
                                <PledgesSummary person={person} />
                            </span>
                        </div>
                        <div className="mt-1 text-sm">
                            <form
                                className="block"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    if (bio == null) setBio(person?.bio || "");
                                    else {
                                        mutations.mutatePerson({ bio: bio.trim() });
                                        setBio(null);
                                    }
                                }}
                            >
                                {bio == null && person?.bio && (
                                    <span className="align-top mr-3">Bio: {person.bio}</span>
                                )}
                                {bio !== null && (
                                    <textarea
                                        value={bio}
                                        onChange={(event) => {
                                            setBio(event.target.value);
                                        }}
                                        autoFocus
                                        className="mr-3 inline w-80 rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                )}
                                <button
                                    type="submit"
                                    className={
                                        "align-top inline button-xs " + (bio && " btn-primary")
                                    }
                                >
                                    {bio !== null
                                        ? "Save"
                                        : person?.bio?.length
                                        ? "Edit"
                                        : "Add a bio"}
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="text-right col-span-4">
                        <div className=" flex-row gap-3 inline-flex">
                            <DialerControls
                                enabled={enabled}
                                outbound={outbound}
                                primaryPhoneNumber={primaryPhoneNumber}
                                hasNext={hasNext}
                                next={next}
                                dial={dial}
                                hangup={hangup}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl  grid grid-flow-col grid-cols-12 gap-x-10 bg-white border-t px-12 py-6 mt-2 -mx-12">
                <div className="col-span-3">
                    <PersonContactInfo person={person} {...mutations} />
                    <PersonTagList person={person} {...mutations} />
                </div>
                <div className="col-span-6 -ml-10">
                    <InteractionHistory
                        person={person}
                        interactions={interactions}
                        {...mutations}
                    />
                </div>
                <div className="col-span-4">
                    <PledgeHistory pledges={person?.pledges} {...mutations} />
                    <DonationHistory donations={person?.donations} {...mutations} />
                    <FECHistoryList FECHistory={FECHistory} />
                </div>
            </div>
        </div>
    );
}

function DialerControls({ outbound, primaryPhoneNumber, hasNext, next, enabled, dial, hangup }) {
    return (
        <>
            {
                <button
                    type="button"
                    onClick={() => dial(primaryPhoneNumber)}
                    {...(!enabled || !primaryPhoneNumber || outbound ? { disabled: true } : {})}
                >
                    <PhoneIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    Call
                </button>
            }
            {/* <button type="button">Merge Records</button> */}
            <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => hangup()}
                {...(enabled && outbound ? {} : { disabled: true })}
            >
                Hang Up
            </button>
            <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                onClick={() => next()}
                {...(enabled && !outbound && hasNext ? {} : { disabled: true })}
            >
                Skip
            </button>
        </>
    );
}
