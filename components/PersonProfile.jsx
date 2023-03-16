import Link from "next/link";
import { useSupabase } from "utils/supabaseHooks";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CheckIcon, HandThumbUpIcon, UserIcon, PhoneIcon } from "@heroicons/react/20/solid";
import InteractionHistory from "./InteractionHistory";
import Breadcrumbs from "./Breadcrumbs";
import PersonContactInfo from "./PersonContactInfo";
import { Tooltip } from "@mui/material";
import { useUser } from "@clerk/nextjs";

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

export default function PersonProfile({ personID, dial, hangup, outbound, hasNext, next }) {
    const { id: userID } = useUser();
    const supabase = useSupabase();
    const [person, setPerson] = useState();
    const [bio, setBio] = useState(null);
    const [isLoading, setLoading] = useState(true);

    const fetchPerson = useCallback(() => {
        supabase
            .from("people")
            .select(
                "*, interactions ( * ), donations ( * ), pledges ( * ), emails ( * ), phone_numbers ( * ), tags ( * )"
            )
            .eq("id", personID)
            .single()
            .then((result) => setPerson(result.data))
            .then(() => {
                setLoading(false);
            });
    }, [supabase, personID]);

    useEffect(() => {
        fetchPerson();
    }, [fetchPerson]);

    const mutations = useMemo(
        (person) => ({
            appendInteraction: async (newInteraction) => {
                let { pledge, ...newInteractionPrepared } = newInteraction;
                newInteractionPrepared.person_id = personID;

                if (pledge) {
                    await supabase.from("pledges").insert({
                        person_id: personID,
                        amount: pledge,
                    });
                }

                if (newInteractionPrepared?.note?.length) {
                    await supabase.from("interactions").insert(newInteractionPrepared);
                }

                fetchPerson();
            },
            mutatePerson: (changedPersonObject) =>
                supabase
                    .from("people")
                    .update(changedPersonObject)
                    .eq("id", personID)
                    .then(fetchPerson),
            addPhone: (newPhone) =>
                supabase
                    .from("phone_numbers")
                    .insert({ phone_number: newPhone, person_id: personID })
                    .then(fetchPerson),
            addEmail: (newEmail) =>
                supabase
                    .from("emails")
                    .insert({ email: newEmail, person_id: personID })
                    .then(fetchPerson),
            deleteEmail: (id) =>
                supabase
                    .from("emails")
                    .update({ remove_date: new Date().toISOString(), remove_user: userID })
                    .eq("id", id)
                    .then(fetchPerson),
            deletePhone: (id) =>
                supabase
                    .from("phone_numbers")
                    .update({ remove_date: new Date().toISOString(), remove_user: userID })
                    .eq("id", id)
                    .then(fetchPerson),
            addTag: (newTag) => supabase.from("tags").insert({ tag: newTag, person_id: personID }),
            restorePhone: (id) =>
                supabase
                    .from("phone_numbers")
                    .update({ remove_date: null, remove_user: null })
                    .eq("id", id)
                    .then(fetchPerson),
            restoreEmail: (id) =>
                supabase
                    .from("emails")
                    .update({ remove_date: null, remove_user: null })
                    .eq("id", id)
                    .then(fetchPerson),
            deleteTag: (id) =>
                supabase
                    .from("tags")
                    .update({ remove_date: new Date().toISOString(), remove_user: userID })
                    .eq("id", id)
                    .then(fetchPerson),
            restoreTag: (id) =>
                supabase
                    .from("tags")
                    .update({ remove_date: null, remove_user: null })
                    .eq("id", id)
                    .then(fetchPerson),
        }),
        [supabase, personID, fetchPerson, person.id]
    );

    if (isLoading) return;

    // let interactions = person.interactions || [];
    var interactions = [
        ...person.interactions.map((i) => ({ ...i, type: "interaction" })),
        ...person.donations.map((i) => ({ ...i, type: "donation" })),
        ...person.pledges.map((i) => ({ ...i, type: "pledge" })),
    ];

    if (!person) {
        return <>No person with that ID exists.</>;
    }
    if (person) {
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
                    <div id="person-header" className="grid grid-cols-2 gap-2">
                        <div id="">
                            <Tooltip title={"Person ID: " + personID} arrow>
                                <h1 className="mb-0">
                                    {person.first_name} {person.last_name}
                                </h1>
                            </Tooltip>
                            <h2 className="text-sm font-normal text-gray-600">
                                {person.occupation} | {person.employer} | {person.state}
                            </h2>
                            <p className="text-sm text-gray-500">
                                <span className="inline-flex flex mr-1.5">
                                    <DonationsSummary person={person} />
                                </span>
                                |
                                <span className="inline-flex flex mx-1.5">
                                    <PledgesSummary person={person} />
                                </span>
                                |
                                <form
                                    className="inline-flex ml-1.5"
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
                            </p>
                        </div>
                        <div className="text-right">
                            <div className=" flex-row gap-3 inline-flex">
                                {
                                    <button
                                        type="button"
                                        onClick={() =>
                                            dial(
                                                person?.phone_numbers?.filter(
                                                    (phone) => !!phone.primary_for
                                                )
                                            )
                                        }
                                        {...(!person?.phone_numbers || outbound
                                            ? { disabled: true }
                                            : {})}
                                    >
                                        <PhoneIcon
                                            className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                        Call
                                    </button>
                                }
                                {/* <button type="button">Merge Records</button> */}
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
                                    onClick={() => next()}
                                    {...(!outbound && hasNext ? {} : { disabled: true })}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl  grid grid-flow-col grid-cols-12 gap-x-10 bg-white border-t px-12 py-6 mt-2 -mx-12">
                    <div className="col-span-4">
                        <PersonContactInfo person={person} {...mutations} />
                        <PersonTagList person={person} {...mutations} />
                    </div>
                    <div className="col-span-8 -ml-10">
                        <InteractionHistory
                            person={person}
                            interactions={interactions}
                            {...mutations}
                        />
                    </div>
                    {/* <div className="col-span-3">
                    <PledgeHistory pledges={person?.pledges} {...mutations} />
                    <DonationHistory donations={person?.donations} {...mutations} />
                </div> */}
                </div>
            </div>
        );
    }
}
