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
import InteractionHistory from "./InteractionHistory";
import Breadcrumbs from "./Breadcrumbs";

import PledgeHistory from "./PledgeHistory";
import DonationHistory from "./DonationHistory";
import PersonContactInfo from "./PersonContactInfo";

export default function PersonProfile({
    personID,
    dial,
    hangup,
    outbound,
    hasNext,
    next,
}) {
    const [person, setPerson] = useState();

    useEffect(() => {
        supabase
            .from("people")
            .select("*, interactions ( * ), donations ( * ), pledges ( * )")
            .eq("id", personID)
            .single()
            .then((result) => setPerson(result.data));
    }, [personID]);

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
            <div id="person-header" className="grid grid-cols-2 gap-16">
                <div id="">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-0">
                        {person.first_name} {person.last_name}
                    </h1>
                    <h2 className="text-sm font-normal text-gray-600">
                        {person.occupation} | {person.employer} | {person.state}
                    </h2>
                    <p className="text-sm text-gray-400">
                        Person ID: {person.id}
                    </p>
                </div>
                <div className="text-right">
                    <div className=" flex-row gap-3 inline-flex">
                        {
                            <button
                                type="button"
                                onClick={() => dial(person.phone)}
                                {...(!person?.phone || outbound
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
                            {...(!outbound && hasNext
                                ? {}
                                : { disabled: true })}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl px-2 grid grid-flow-col grid-cols-12 gap-x-10 bg-white border-t px-8 py-6 mt-6 -mx-8">
                <div className="col-span-3">
                    <PersonContactInfo person={person} />
                </div>
                <div className="col-span-6">
                    <InteractionHistory
                        person={person}
                        interactions={interactions}
                    />
                </div>
                <div className="col-span-3">
                    <PledgeHistory donations={person?.pledges} />
                    <DonationHistory donations={person?.donations} />
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
}
