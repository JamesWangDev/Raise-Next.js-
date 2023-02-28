import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import supabase from "utils/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    CheckIcon,
    HandThumbUpIcon,
    UserIcon,
    PhoneIcon,
} from "@heroicons/react/20/solid";
import InteractionHistory from "components/InteractionHistory";
import Breadcrumbs from "components/Breadcrumbs";

// import useorganization from clerk.dev
import { useOrganization } from "@clerk/nextjs";

export default function SpecificListPage() {
    const router = useRouter();
    const { personID } = router.query;
    const [person, setPerson] = useState();

    //get orgid using clerk
    const { organization } = useOrganization();

    useEffect(() => {
        supabase
            .from("people")
            .select("*, interactions ( * )")
            .eq("organization_id", organization?.id)
            .eq("id", personID)
            .single()
            .then((result) => setPerson(result.data));
    }, [personID]);

    var interactions = person?.interactions || [];
    console.log(interactions);

    return person ? (
        <div className="py-2">
            <div id="person-header" className="grid grid-cols-2 gap-16">
                <div id="">
                    <Breadcrumbs
                        pages={[
                            { name: "People", href: "/people", current: false },
                            {
                                name:
                                    person.first_name + " " + person.last_name,
                                href: "/people/" + person.id,
                                current: true,
                            },
                        ]}
                    />
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {person.first_name} {person.last_name}
                    </h1>{" "}
                    <h2 className="text-base font-semibold text-gray-700">
                        {person.occupation} | {person.employer} | {person.state}
                    </h2>
                    <p className="text-sm">Person ID: {person.id}</p>
                </div>
                <div className="text-right">
                    {person.phone ? (
                        <button type="button">
                            <PhoneIcon
                                className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                            Call
                        </button>
                    ) : (
                        <button type="button" disabled>
                            <PhoneIcon
                                className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                            Call
                        </button>
                    )}
                    <button type="button">Merge Records</button>
                </div>
            </div>
            <div className="max-w-7xl px-2 grid grid-flow-col grid-cols-4 gap-x-12 bg-white border-t-2 px-6 py-6 mt-6 -mx-6">
                <div className="col-span-1">
                    <PersonContactInfo person={person} />
                </div>
                <div className="col-span-2">
                    <InteractionHistory
                        person={person}
                        interactions={interactions}
                    />
                </div>
                <div className="col-span-1">Last column</div>
            </div>
        </div>
    ) : (
        <></>
    );
}

function PersonContactInfo({ person }) {
    return (
        <div>
            <h2>Contact Information</h2>
            <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                    Phone Numbers
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{person.phone}</dd>
            </div>
            <div className="sm:col-span-1 mt-3">
                <dt className="text-sm font-medium text-gray-500">Emails</dt>
                <dd className="mt-1 text-sm text-gray-900">{person.email}</dd>
            </div>
            <div className="sm:col-span-1 mt-3">
                <dt className="text-sm font-medium text-gray-500">Addresses</dt>
                <dd className="mt-1 text-sm text-gray-900">
                    {person.addr1}
                    <br />
                    {person.addr2}
                    {person.addr2 ? <br /> : null}
                    {person.city}, {person.state} {person.zip}
                </dd>
            </div>
        </div>
    );
}

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
