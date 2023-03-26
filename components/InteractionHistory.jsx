import { useSupabase } from "lib/supabaseHooks";
import { useState } from "react";
import { CheckIcon, HandThumbUpIcon, UserIcon } from "@heroicons/react/20/solid";

function capitalize(input) {
    return input?.length > 0 ? input.charAt(0).toUpperCase() + input.slice(1) : "";
}

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
import AddInteractionCard from "./AddInteractionCard";

export default function InteractionHistory({ person, interactions, appendInteraction }) {
    const supabase = useSupabase();

    return (
        <div className="flow-root">
            <h2>Log an Interaction:</h2>
            <AddInteractionCard person={person} appendInteraction={appendInteraction} />
            <h2 className="mt-5">Interaction History</h2>
            <ul role="list" className="-mb-8 mt-3">
                {interactions
                    ?.sort((a, b) => (new Date(a.created_at) < new Date(b.created_at) ? 1 : -1))
                    ?.map((interaction, eventIdx) => {
                        interaction.iconBackground = "bg-gray-400";
                        interaction.icon = UserIcon;
                        interaction.date = new Date(
                            interaction.created_at || interaction.date
                        ).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        });
                        interaction.datetime = new Date(interaction.created_at).toString();
                        interaction.href = "";

                        interaction.content = [
                            capitalize(interaction?.type),
                            interaction?.contact_type,
                            interaction?.disposition,
                            interaction?.note,
                            interaction?.amount && "$" + interaction?.amount,
                        ]
                            .filter((item) => !!item)
                            .join(", ");

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
                                                    {interaction.content}
                                                    {/* <a
                                                    href={interaction.href}
                                                    className="font-medium text-gray-900"
                                                >
                                                    {interaction.target}
                                                </a> */}
                                                </p>
                                            </div>
                                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                <time dateTime={interaction.datetime}>
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
