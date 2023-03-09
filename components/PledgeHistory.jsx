import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useSupabase } from "utils/supabaseHooks";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CheckIcon, HandThumbUpIcon, UserIcon, PhoneIcon } from "@heroicons/react/20/solid";
import InteractionHistory from "./InteractionHistory";
import Breadcrumbs from "./Breadcrumbs";

export default function PledgeHistory({ pledges }) {
    return (
        <div>
            <h2>Pledge History</h2>
            <ul role="list" className="divide-y divide-gray-200">
                {pledges?.map((pledge) => (
                    <li key={pledge.id} className="flex py-4 text-sm text-gray-600">
                        ${pledge.amount} -{" "}
                        {new Date(pledge.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </li>
                ))}
            </ul>
            {!pledges?.length && <p className="text-sm">No pledges found.</p>}
        </div>
    );
}
