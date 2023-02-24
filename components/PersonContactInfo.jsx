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

export default function PersonContactInfo({ person }) {
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
