import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useSupabase } from "utils/supabaseHooks";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CheckIcon, HandThumbUpIcon, UserIcon, PhoneIcon } from "@heroicons/react/20/solid";
import InteractionHistory from "./InteractionHistory";
import Breadcrumbs from "./Breadcrumbs";

export default function DonationHistory({ donations }) {
    return (
        <div>
            <h2 className="mt-7">Donation History</h2>
            <ul role="list" className="divide-y divide-gray-200">
                {donations?.map((donation) => (
                    <li key={donation.id} className="flex py-4 text-sm text-gray-600">
                        ${donation.amount} - {donation.date.split(" ")[0]}
                    </li>
                ))}
            </ul>
            {!donations?.length && <p className="text-sm">No donations found.</p>}
            {/* Add donation button */}
        </div>
    );
}
