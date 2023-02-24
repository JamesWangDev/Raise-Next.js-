import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import supabase from "../utils/supabase";
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

export default function PersonProfile({ personID }) {
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
