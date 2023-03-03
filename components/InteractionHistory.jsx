import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useSupabase } from "utils/supabaseHooks";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    CheckIcon,
    HandThumbUpIcon,
    UserIcon,
} from "@heroicons/react/20/solid";

// useUser and useOrganization are used to get the current user and organization
import { useUser, useOrganization } from "@clerk/nextjs";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
import AddInteractionCard from "./AddInteractionCard";

function AddModal() {
    return (
        <>
            <p>Add</p>
        </>
    );
}

export default function InteractionHistory({
    person,
    interactions: passedInteractions,
}) {
    const supabase = useSupabase();

    // showModal and addModalType are states that are used to control the display of the modal
    const [isModalShowing, showModal] = useState(false);
    const [addModalType, setAddModalType] = useState("");
    const [interactions, setInteractions] = useState(
        passedInteractions?.length > 0 ? passedInteractions : []
    );
    // get current org
    const { organization } = useOrganization();
    const { user } = useUser();

    const appendInteraction = (newInteraction) => {
        // Prepare interaction for inserting
        let newInteractionPrepared = {
            ...newInteraction,
            person_id: person.id,
            organization_id: organization.id,
            user_id: user.id,
        };

        // Amalgate into state
        setInteractions([...interactions, newInteractionPrepared]);

        // Update supabase
        console.log({ newInteractionPrepared });
        supabase.from("interactions").insert(newInteractionPrepared);
        // .select();
        // .then((newInteractionResponse) => {
        //     console.log("New interaction added!");
        //     // console.log({ newInteractionResponse });
        // });
    };

    return (
        <div className="flow-root">
            <h2>Interaction History</h2>
            <AddInteractionCard
                person={person}
                appendInteraction={appendInteraction}
            />
            {isModalShowing ? <AddModal type={addModalType} /> : null}
            <ul role="list" className="-mb-8 mt-6">
                {interactions?.map((interaction, eventIdx) => {
                    interaction.iconBackground = "bg-gray-400";
                    interaction.icon = UserIcon;

                    interaction.date = new Date(
                        interaction.created_at
                    ).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                    });
                    interaction.datetime = new Date(
                        interaction.created_at
                    ).toString();
                    interaction.href = "";

                    interaction.content =
                        interaction.contact_type +
                        ", " +
                        interaction.disposition +
                        ", " +
                        interaction.note;

                    return (
                        <li key={interaction.id}>
                            <div className="relative pb-8">
                                {eventIdx !== interactions.length - 1 ? (
                                    <span
                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                        aria-hidden="true"
                                    />
                                ) : null}
                                <div className="relative flex space-x-3">
                                    <div>
                                        <span
                                            className={classNames(
                                                interaction.iconBackground,
                                                "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                                            )}
                                        >
                                            <interaction.icon
                                                className="h-5 w-5 text-white"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </div>
                                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pb-1.5">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {interaction.content}{" "}
                                                <a
                                                    href={interaction.href}
                                                    className="font-medium text-gray-900"
                                                >
                                                    {interaction.target}
                                                </a>
                                            </p>
                                        </div>
                                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                            <time
                                                dateTime={interaction.datetime}
                                            >
                                                {interaction.date}
                                            </time>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
