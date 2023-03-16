import { useSupabase } from "utils/supabaseHooks";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CheckIcon, HandThumbUpIcon, UserIcon, PhoneIcon } from "@heroicons/react/20/solid";
import InteractionHistory from "./InteractionHistory";
import Breadcrumbs from "./Breadcrumbs";

import PledgeHistory from "./PledgeHistory";
import DonationHistory from "./DonationHistory";
import PersonContactInfo from "./PersonContactInfo";
import { Tooltip } from "@mui/material";

export default function PersonProfile({ personID, dial, hangup, outbound, hasNext, next }) {
    const supabase = useSupabase();
    const [person, setPerson] = useState();
    const [bio, setBio] = useState(null);

    const fetchPerson = useCallback(() => {
        supabase
            .from("people")
            .select(
                "*, interactions ( * ), donations ( * ), pledges ( * ), emails ( * ), phone_numbers ( * )"
            )
            .eq("id", personID)
            .single()
            .then((result) => setPerson(result.data));
    }, [supabase, personID]);

    useEffect(() => {
        fetchPerson();
    }, [fetchPerson]);

    const mutatePerson = useCallback(
        (changedPersonObject) => {
            supabase
                .from("people")
                .update(changedPersonObject)
                .eq("id", personID)
                .then(fetchPerson);
            // .select()
            // .single()
            // .then((result) => setPerson(result.data));
        },
        [person, personID]
    );

    const addPhone = useCallback(
        (newPhoneNumber) => {
            supabase
                .from("phone_numbers")
                .insert({ phone_number: newPhoneNumber, person_id: personID })
                .then(fetchPerson);
        },
        [supabase, personID, fetchPerson]
    );

    const addEmail = useCallback(
        (newEmail) => {
            supabase
                .from("emails")
                .insert({ email: newEmail, person_id: personID })
                .then(fetchPerson);
        },
        [supabase, personID, fetchPerson]
    );

    const deletePhone = useCallback(
        (id) => {
            supabase.from("phone_numbers").delete().eq("id", id).then(fetchPerson);
        },
        [supabase, personID, fetchPerson]
    );
    const deleteEmail = useCallback(
        (id) => {
            supabase.from("emails").delete().eq("id", id).then(fetchPerson);
        },
        [supabase, personID, fetchPerson]
    );

    const appendInteraction = async (newInteraction) => {
        let { pledge, ...newInteractionPrepared } = newInteraction;
        newInteractionPrepared.person_id = person.id;

        if (pledge) {
            await supabase.from("pledges").insert({
                person_id: person.id,
                amount: pledge,
            });
        }

        if (newInteractionPrepared?.note?.length) {
            await supabase.from("interactions").insert(newInteractionPrepared);
        }

        fetchPerson();
    };

    const mutations = {
        mutatePerson,
        addPhone,
        addEmail,
        deleteEmail,
        deletePhone,
        appendInteraction,
    };

    var interactions = person?.interactions || [];

    return person ? (
        <div className="mx-auto max-w-7xl px-2">
            <div className="">
                <Breadcrumbs
                    pages={[
                        { name: "People", href: "/people", current: false },
                        {
                            name: person.first_name + " " + person.last_name,
                            href: "/people/" + person.id,
                            current: true,
                        },
                    ]}
                />
            </div>
            <div id="person-header" className="grid grid-cols-2 gap-2">
                <div id="">
                    <Tooltip title={"Person ID: " + person.id} arrow>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-0">
                            {person.first_name} {person.last_name}
                        </h1>
                    </Tooltip>
                    <h2 className="text-sm font-normal text-gray-600">
                        {person.occupation} | {person.employer} | {person.state}
                    </h2>
                    <p className="text-sm text-gray-500">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (bio == null) setBio(person?.bio || "");
                                else {
                                    mutatePerson({ bio: bio.trim() });
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
                                className={"align-top inline button-xs " + (bio && " btn-primary")}
                            >
                                {bio !== null ? "Save" : person?.bio?.length ? "Edit" : "Add a bio"}
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
                                {...(!person?.phone_numbers || outbound ? { disabled: true } : {})}
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
            <div className="max-w-7xl  grid grid-flow-col grid-cols-12 gap-x-10 bg-white border-t px-12 py-6 mt-2 -mx-12">
                <div className="col-span-3">
                    <PersonContactInfo person={person} {...mutations} />
                </div>
                <div className="col-span-6 -ml-10">
                    <InteractionHistory
                        person={person}
                        interactions={interactions}
                        {...mutations}
                    />
                </div>
                <div className="col-span-3">
                    <PledgeHistory pledges={person?.pledges} {...mutations} />
                    <DonationHistory donations={person?.donations} {...mutations} />
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
}
