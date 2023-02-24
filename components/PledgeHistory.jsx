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

export default function PledgeHistory({ pledges }) {
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
