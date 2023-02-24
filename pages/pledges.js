import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import SupabaseTable from "../components/SupabaseTable";
import { useState, useEffect } from "react";

export default function Dashboard() {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-2 ">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Pledges
                </h1>
            </div>
            <div className="mx-auto max-w-7xl px-2  ">
                <SupabaseTable table="pledges" />
            </div>
        </div>
    );
}
