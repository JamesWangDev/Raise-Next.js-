import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import supabase from "../../utils/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    CheckIcon,
    HandThumbUpIcon,
    UserIcon,
    PhoneIcon,
} from "@heroicons/react/20/solid";
import InteractionHistory from "../../components/InteractionHistory";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function SpecificListPage() {
    const router = useRouter();
    const { personID } = router.query;
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

function PledgeHistory({ pledges }) {
    return (
        <div>
            <h2>Pledge History</h2>
            {pledges?.map((pledge) => (
                <>{JSON.stringify(pledge, 0, 2)}</>
            ))}
            {!pledges?.length && <p className="text-sm">No pledges found.</p>}
            {/* Add pledge button */}
        </div>
    );
}

function DonationHistory({ donations }) {
    return (
        <div>
            <h2 className="mt-7">Donation History</h2>
            {donations?.map((donation) => (
                <>{JSON.stringify(donation, 0, 2)}</>
            ))}
            {!donations?.length && (
                <p className="text-sm">No donations found.</p>
            )}
            {/* Add donation button */}
        </div>
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
                <button className="mt-2 button-xs" type="button">
                    Add Phone
                </button>
            </div>
            <div className="sm:col-span-1 mt-5">
                <dt className="text-sm font-medium text-gray-500">Emails</dt>
                <dd className="mt-1 text-sm text-gray-900">{person.email}</dd>
                <button className="mt-2 button-xs" type="button">
                    Add Email
                </button>
            </div>
            <div className="sm:col-span-1 mt-5">
                <dt className="text-sm font-medium text-gray-500">Addresses</dt>
                <dd className="mt-1 text-sm text-gray-900">
                    {person.addr1}
                    <br />
                    {person.addr2}
                    {person.addr2 ? <br /> : null}
                    {person.city}, {person.state} {person.zip}
                </dd>
                <button className="mt-2 button-xs" type="button">
                    Add Address
                </button>
            </div>
        </div>
    );
}

// var interactions = [
//     {
//         id: 1,
//         content: "Applied to",
//         target: "Front End Developer",
//         href: "#",
//         date: "Sep 20",
//         datetime: "2020-09-20",
//         icon: UserIcon,
//         iconBackground: "bg-gray-400",
//     },
//     {
//         id: 2,
//         content: "Advanced to phone screening by",
//         target: "Bethany Blake",
//         href: "#",
//         date: "Sep 22",
//         datetime: "2020-09-22",
//         icon: HandThumbUpIcon,
//         iconBackground: "bg-blue-500",
//     },
//     {
//         id: 3,
//         content: "Completed phone screening with",
//         target: "Martha Gardner",
//         href: "#",
//         date: "Sep 28",
//         datetime: "2020-09-28",
//         icon: CheckIcon,
//         iconBackground: "bg-green-500",
//     },
//     {
//         id: 4,
//         content: "Advanced to interview by",
//         target: "Bethany Blake",
//         href: "#",
//         date: "Sep 30",
//         datetime: "2020-09-30",
//         icon: HandThumbUpIcon,
//         iconBackground: "bg-blue-500",
//     },
//     {
//         id: 5,
//         content: "Completed interview with",
//         target: "Katherine Snyder",
//         href: "#",
//         date: "Oct 4",
//         datetime: "2020-10-04",
//         icon: CheckIcon,
//         iconBackground: "bg-green-500",
//     },
// ];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
