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

export default function DonationHistory({ donations }) {
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
