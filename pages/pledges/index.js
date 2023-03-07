import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import SupabaseTable from "components/SupabaseTable";
import { useState, useEffect } from "react";
import Breadcrumbs from "components/Breadcrumbs";
import PageTitle from "components/PageTitle";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-2">
                <Breadcrumbs pages={[{ name: "Pledges", href: "/pledges" }]} />
                <div className="grid grid-cols-2 gap-16 -mb-3">
                    <div>
                        {" "}
                        <PageTitle title="Pledges" descriptor="From all donors/prospects" />
                        {/* New pledge button as primary btn */}
                    </div>
                    <div className="text-right">
                        <button className="text-sm btn-primary" type="button">
                            <PlusIcon
                                className="w-4"
                                onClick={() => {
                                    router.push("/pledges/new");
                                }}
                            />
                            &nbsp; New Pledge
                        </button>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-2">
                <SupabaseTable table="pledges" />
            </div>
        </div>
    );
}
